import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth';
import {
  getFieldsByTemplateId,
  getFieldById,
  createField,
  updateField,
  deleteField
} from '../controllers/field.controller';

const router = Router();

// すべてのフィールドルートで認証を要求
router.use(authenticateJWT);

// テンプレートに属するフィールド一覧の取得
router.get('/template/:templateId', getFieldsByTemplateId);

// 特定のフィールドの取得
router.get('/:id', getFieldById);

// フィールドの作成（管理者またはマネージャーのみ）
router.post('/', authorizeRoles('admin', 'manager'), createField);

// フィールドの更新（管理者またはマネージャーのみ）
router.put('/:id', authorizeRoles('admin', 'manager'), updateField);

// フィールドの削除（管理者またはマネージャーのみ）
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteField);

export default router;
