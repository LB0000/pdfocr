import { Router } from 'express';
import multer from 'multer';
import { register, login } from '../controllers/auth.controller';
import { getAllDocuments, getDocumentById, uploadDocument, updateDocument, deleteDocument } from '../controllers/document.controller';
import { getAllTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate } from '../controllers/template.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// 認証ルート
router.post('/auth/register', register);
router.post('/auth/login', login);

// ドキュメントルート
router.get('/documents', authMiddleware, getAllDocuments);
router.get('/documents/:id', authMiddleware, getDocumentById);
router.post('/documents', authMiddleware, upload.single('file'), uploadDocument);
router.put('/documents/:id', authMiddleware, updateDocument);
router.delete('/documents/:id', authMiddleware, deleteDocument);

// テンプレートルート
router.get('/templates', authMiddleware, getAllTemplates);
router.get('/templates/:id', authMiddleware, getTemplateById);
router.post('/templates', authMiddleware, createTemplate);
router.put('/templates/:id', authMiddleware, updateTemplate);
router.delete('/templates/:id', authMiddleware, deleteTemplate);

export default router;
