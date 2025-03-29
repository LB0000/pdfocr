import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth';
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  setDefaultTemplate
} from '../controllers/template.controller';

const router = Router();

// すべてのテンプレートルートで認証を要求
router.use(authenticateJWT);

// テンプレート一覧の取得
router.get('/', getAllTemplates);

// 特定のテンプレートの取得
router.get('/:id', getTemplateById);

// テンプレートの作成（管理者またはマネージャーのみ）
router.post('/', authorizeRoles('admin', 'manager'), createTemplate);

// テンプレートの更新（管理者またはマネージャーのみ）
router.put('/:id', authorizeRoles('admin', 'manager'), updateTemplate);

// テンプレートの削除（管理者またはマネージャーのみ）
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteTemplate);

// デフォルトテンプレートの設定（管理者またはマネージャーのみ）
router.patch('/:id/default', authorizeRoles('admin', 'manager'), setDefaultTemplate);

export default router;
