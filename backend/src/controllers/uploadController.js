import multer from 'multer';
import path from 'path';
import Document from '../models/Document.js';

// Configure multer storage in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.txt', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Only .txt and .md files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Convert plain text or markdown to simple HTML paragraphs for TipTap
const convertTextToHTML = (text) => {
  if (!text || text.trim() === '') {
    return '<p></p>';
  }
  
  const lines = text.split(/\r?\n/);
  const htmlLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return '<p></p>';
    }
    // Simple heading detection for Markdown files
    if (trimmed.startsWith('# ')) {
      return `<h1>${escapeHTML(trimmed.slice(2))}</h1>`;
    }
    if (trimmed.startsWith('## ')) {
      return `<h2>${escapeHTML(trimmed.slice(3))}</h2>`;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return `<li>${escapeHTML(trimmed.slice(2))}</li>`;
    }
    return `<p>${escapeHTML(line)}</p>`;
  });

  return htmlLines.join('');
};

const escapeHTML = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const handleDocumentUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const rawContent = req.file.buffer.toString('utf-8');
    const htmlContent = convertTextToHTML(rawContent);

    const originalName = req.file.originalname;
    const documentTitle = path.parse(originalName).name || 'Imported document';

    const newDoc = await Document.create({
      title: documentTitle,
      content: htmlContent,
      owner: req.user.id,
    });

    const populatedDoc = await Document.findById(newDoc._id).populate('owner', 'name email');

    return res.status(201).json({
      message: 'File imported successfully',
      document: populatedDoc,
      userAccess: {
        isOwner: true,
        permission: 'OWNER',
      },
    });
  } catch (error) {
    console.error('[Upload Handler Error]', error);
    return res.status(500).json({ error: 'Failed to process document upload' });
  }
};
