import Document from '../models/Document.js';
import Share from '../models/Share.js';

export const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch owned documents
    const ownedDocuments = await Document.find({ owner: userId })
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 });

    // Fetch shared documents
    const shares = await Share.find({ user: userId })
      .populate({
        path: 'document',
        populate: { path: 'owner', select: 'name email' },
      })
      .sort({ updatedAt: -1 });

    const sharedDocuments = shares
      .filter((share) => share.document !== null)
      .map((share) => ({
        ...share.document.toObject(),
        sharedPermission: share.permission,
        sharedAt: share.createdAt,
      }));

    return res.status(200).json({
      ownedDocuments,
      sharedDocuments,
    });
  } catch (error) {
    console.error('[getDocuments Error]', error);
    return res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

export const createDocument = async (req, res) => {
  try {
    const title = req.body.title || 'Untitled document';
    const content = req.body.content || '<p></p>';

    const newDoc = await Document.create({
      title,
      content,
      owner: req.user.id,
    });

    const populatedDoc = await Document.findById(newDoc._id).populate('owner', 'name email');

    return res.status(201).json({
      document: populatedDoc,
      userAccess: {
        isOwner: true,
        permission: 'OWNER',
      },
    });
  } catch (error) {
    console.error('[createDocument Error]', error);
    return res.status(500).json({ error: 'Failed to create document' });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { document, isOwner, permission } = req.docAccess;

    return res.status(200).json({
      document,
      userAccess: {
        isOwner,
        permission,
      },
    });
  } catch (error) {
    console.error('[getDocumentById Error]', error);
    return res.status(500).json({ error: 'Failed to fetch document' });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { document, isOwner, permission } = req.docAccess;
    const { title, content } = req.body;

    if (title !== undefined) {
      document.title = title.trim() || 'Untitled document';
    }

    if (content !== undefined) {
      document.content = content;
    }

    await document.save();

    return res.status(200).json({
      document,
      userAccess: {
        isOwner,
        permission,
      },
    });
  } catch (error) {
    console.error('[updateDocument Error]', error);
    return res.status(500).json({ error: 'Failed to update document' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const docId = req.params.id;

    await Document.findByIdAndDelete(docId);
    await Share.deleteMany({ document: docId });

    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('[deleteDocument Error]', error);
    return res.status(500).json({ error: 'Failed to delete document' });
  }
};
