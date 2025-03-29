import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth';
import {
  getAllDocuments,
  getDocumentById,
  uploadDocument,
  processDocument,
  updateDocument,
  deleteDocument,
  getDocumentFields
} from '../controllers/document.controller';

const router = Router();

// すべてのドキュメントルートで認証を要求
router.use(authenticateJWT);

// ドキュメント一覧の取得
router.get('/', getAllDocuments);

// 特定のドキュメントの取得
router.get('/:id', getDocumentById);

// ドキュメントのフィールド一覧の取得
router.get('/:id/fields', getDocumentFields);

// ドキュメントのアップロード
router.post('/upload', uploadDocument);

// ドキュメントの処理（OCR実行）
router.post('/:id/process', processDocument);

// ドキュメント情報の更新
router.put('/:id', updateDocument);

// ドキュメントの削除
router.delete('/:id', deleteDocument);

export default router;
