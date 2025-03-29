import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import documentRoutes from './document.routes';
import templateRoutes from './template.routes';
import fieldRoutes from './field.routes';
import modelRoutes from './model.routes';

const router = Router();

// 各ルートの設定
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/templates', templateRoutes);
router.use('/fields', fieldRoutes);
router.use('/models', modelRoutes);

// ヘルスチェック用エンドポイント
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
