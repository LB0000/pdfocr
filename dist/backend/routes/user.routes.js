"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// すべてのユーザールートで認証を要求
router.use(auth_1.authenticateJWT);
// ユーザー一覧の取得（管理者のみ）
router.get('/', (0, auth_1.authorizeRoles)('admin'), user_controller_1.getAllUsers);
// 特定のユーザーの取得（自分自身または管理者）
router.get('/:id', user_controller_1.getUserById);
// ユーザーの作成（管理者のみ）
router.post('/', (0, auth_1.authorizeRoles)('admin'), user_controller_1.createUser);
// ユーザーの更新（自分自身または管理者）
router.put('/:id', user_controller_1.updateUser);
// ユーザーの削除（管理者のみ）
router.delete('/:id', (0, auth_1.authorizeRoles)('admin'), user_controller_1.deleteUser);
// ユーザーロールの更新（管理者のみ）
router.patch('/:id/role', (0, auth_1.authorizeRoles)('admin'), user_controller_1.updateUserRole);
exports.default = router;
//# sourceMappingURL=user.routes.js.map