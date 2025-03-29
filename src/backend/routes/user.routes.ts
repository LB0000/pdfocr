import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  updateUserRole
} from '../controllers/user.controller';

const router = Router();

// すべてのユーザールートで認証を要求
router.use(authenticateJWT);

// ユーザー一覧の取得（管理者のみ）
router.get('/', authorizeRoles('admin'), getAllUsers);

// 特定のユーザーの取得（自分自身または管理者）
router.get('/:id', getUserById);

// ユーザーの作成（管理者のみ）
router.post('/', authorizeRoles('admin'), createUser);

// ユーザーの更新（自分自身または管理者）
router.put('/:id', updateUser);

// ユーザーの削除（管理者のみ）
router.delete('/:id', authorizeRoles('admin'), deleteUser);

// ユーザーロールの更新（管理者のみ）
router.patch('/:id/role', authorizeRoles('admin'), updateUserRole);

export default router;
