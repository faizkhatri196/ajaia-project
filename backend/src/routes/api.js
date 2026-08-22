import express from 'express';
import multer from 'multer';
import { login, logout, getMe, getUsers } from '../controllers/authController.js';
import {
  getDocuments,
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from '../controllers/documentController.js';
import { getShares, shareDocument } from '../controllers/shareController.js';
import { upload, handleDocumentUpload } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { verifyDocAccess } from '../middleware/docAccess.js';

const router = express.Router();

// Auth routes
router.post('/auth/login', login);
router.post('/auth/logout', authenticateToken, logout);
router.get('/auth/me', authenticateToken, getMe);
router.get('/auth/users', authenticateToken, getUsers);

// Document routes
router.get('/documents', authenticateToken, getDocuments);
router.post('/documents', authenticateToken, createDocument);
router.get('/documents/:id', authenticateToken, verifyDocAccess('READ'), getDocumentById);
router.put('/documents/:id', authenticateToken, verifyDocAccess('READ'), updateDocument);
router.delete('/documents/:id', authenticateToken, verifyDocAccess('OWNER'), deleteDocument);

// Sharing routes
router.get('/documents/:id/shares', authenticateToken, verifyDocAccess('OWNER'), getShares);
router.post('/documents/:id/share', authenticateToken, verifyDocAccess('OWNER'), shareDocument);

// File Upload route
router.post('/upload', authenticateToken, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum allowed size is 5MB.' });
      }
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, handleDocumentUpload);

export default router;
