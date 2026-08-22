import express from 'express';
import { login, logout, getMe, getUsers, triggerSeed } from '../controllers/authController.js';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/documentController.js';
import { getShares, shareDocument } from '../controllers/shareController.js';
import { uploadDocument } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { verifyDocAccess } from '../middleware/docAccess.js';

const router = express.Router();

// Public Auth & Seeder Routes
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.all('/auth/seed', triggerSeed);

// Protected Profile Route
router.get('/auth/me', authenticateToken, getMe);
router.get('/users', authenticateToken, getUsers);

// Document Management Routes (Protected)
router.get('/documents', authenticateToken, getDocuments);
router.post('/documents', authenticateToken, createDocument);
router.post('/documents/upload', authenticateToken, uploadDocument);

// Document Resource Routes (Protected with docAccess Middleware)
router.get('/documents/:id', authenticateToken, verifyDocAccess('READ'), getDocumentById);
router.put('/documents/:id', authenticateToken, verifyDocAccess('EDITOR'), updateDocument);
router.delete('/documents/:id', authenticateToken, verifyDocAccess('OWNER'), deleteDocument);

// Document Sharing Routes (Protected with docAccess Middleware)
router.get('/documents/:id/shares', authenticateToken, verifyDocAccess('READ'), getShares);
router.post('/documents/:id/shares', authenticateToken, verifyDocAccess('OWNER'), shareDocument);

export default router;
