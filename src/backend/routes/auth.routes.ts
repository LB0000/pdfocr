import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

// 認証関連のルート
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateJWT, logout);

export default router;
