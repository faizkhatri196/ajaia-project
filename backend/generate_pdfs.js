import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/Infinity/OneDrive/Desktop/llama-i';

const markdownToPDF = (mdFilePath, pdfFilePath, title) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(mdFilePath)) {
        console.warn(`[PDF Generator] File ${mdFilePath} does not exist. Skipping.`);
        return resolve();
      }
      const mdContent = fs.readFileSync(mdFilePath, 'utf-8');
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(pdfFilePath);
      doc.pipe(stream);

      // Document Title Header
      doc.fillColor('#1e293b').fontSize(22).font('Helvetica-Bold').text(title, { align: 'center' });
      doc.moveDown(0.5);
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);

      const lines = mdContent.split('\n');

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
          doc.moveDown(0.3);
          return;
        }

        if (trimmed.startsWith('# ')) {
          doc.moveDown(0.5);
          doc.fillColor('#0f172a').fontSize(18).font('Helvetica-Bold').text(trimmed.replace(/^#\s+/, ''));
          doc.moveDown(0.3);
        } else if (trimmed.startsWith('## ')) {
          doc.moveDown(0.5);
          doc.fillColor('#1e40af').fontSize(14).font('Helvetica-Bold').text(trimmed.replace(/^##\s+/, ''));
          doc.moveDown(0.2);
        } else if (trimmed.startsWith('### ')) {
          doc.moveDown(0.3);
          doc.fillColor('#334155').fontSize(12).font('Helvetica-Bold').text(trimmed.replace(/^###\s+/, ''));
          doc.moveDown(0.2);
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          doc.fillColor('#334155').fontSize(10).font('Helvetica').text(`•  ${trimmed.slice(2)}`, { indent: 15 });
          doc.moveDown(0.15);
        } else if (trimmed.startsWith('```')) {
          doc.fillColor('#64748b').fontSize(9).font('Helvetica-Oblique').text(trimmed);
        } else {
          const cleanText = trimmed
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
            .replace(/`/g, '');
          doc.fillColor('#334155').fontSize(10).font('Helvetica').text(cleanText, { align: 'left' });
          doc.moveDown(0.2);
        }
      });

      doc.end();
      stream.on('finish', () => {
        console.log(`[PDF Generator] Successfully generated ${pdfFilePath}`);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

async function buildAllPDFs() {
  await markdownToPDF(path.join(rootDir, 'ARCHITECTURE.md'), path.join(rootDir, 'ARCHITECTURE.pdf'), 'Ajaia Docs — Architecture Document');
  await markdownToPDF(path.join(rootDir, 'AI-WORKFLOW.md'), path.join(rootDir, 'AI-WORKFLOW.pdf'), 'Ajaia Docs — AI Workflow & Evaluation Log');
  await markdownToPDF(path.join(rootDir, 'README.md'), path.join(rootDir, 'README.pdf'), 'Ajaia Docs — Product & Developer Guide');
  await markdownToPDF(path.join(rootDir, 'SUBMISSION.md'), path.join(rootDir, 'SUBMISSION.pdf'), 'Ajaia Docs — Official Submission Document');
  await markdownToPDF(path.join(rootDir, 'INFO_PAGE.md'), path.join(rootDir, 'INFO_PAGE.pdf'), 'Ajaia Docs — System Info Reference Document');
}

buildAllPDFs().catch((err) => console.error('PDF Generation Error:', err));
