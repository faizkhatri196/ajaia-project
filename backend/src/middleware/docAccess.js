import mongoose from 'mongoose';
import Document from '../models/Document.js';
import Share from '../models/Share.js';

export const verifyDocAccess = (requiredPermission = 'READ') => {
  return async (req, res, next) => {
    try {
      const docId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(docId)) {
        return res.status(400).json({ error: 'Invalid document ID format' });
      }

      const document = await Document.findById(docId).populate('owner', 'name email');
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (!document.owner) {
        return res.status(404).json({ error: 'Document owner no longer exists' });
      }

      const currentUserId = req.user.id.toString();
      const ownerId = document.owner._id ? document.owner._id.toString() : document.owner.toString();

      let isOwner = currentUserId === ownerId;
      let permission = null;

      if (isOwner) {
        permission = 'OWNER';
      } else {
        const shareRecord = await Share.findOne({
          document: docId,
          user: req.user.id,
        });

        if (shareRecord) {
          permission = shareRecord.permission; // 'EDITOR'
        }
      }

      if (!permission) {
        return res.status(403).json({ error: "You don't have permission to access this document." });
      }

      if (requiredPermission === 'OWNER' && !isOwner) {
        return res.status(403).json({ error: 'Only the document owner can perform this action.' });
      }

      req.docAccess = {
        document,
        isOwner,
        permission,
      };

      next();
    } catch (error) {
      console.error('[DocAccess Error]', error);
      return res.status(500).json({ error: 'Failed to verify document access rights' });
    }
  };
};
