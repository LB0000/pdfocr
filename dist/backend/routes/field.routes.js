"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const field_controller_1 = require("../controllers/field.controller");
const router = (0, express_1.Router)();
// すべてのフィールドルートで認証を要求
router.use(auth_1.authenticateJWT);
// テンプレートに属するフィールド一覧の取得
router.get('/template/:templateId', field_controller_1.getFieldsByTemplateId);
// 特定のフィールドの取得
router.get('/:id', field_controller_1.getFieldById);
// フィールドの作成（管理者またはマネージャーのみ）
router.post('/', (0, auth_1.authorizeRoles)('admin', 'manager'), field_controller_1.createField);
// フィールドの更新（管理者またはマネージャーのみ）
router.put('/:id', (0, auth_1.authorizeRoles)('admin', 'manager'), field_controller_1.updateField);
// フィールドの削除（管理者またはマネージャーのみ）
router.delete('/:id', (0, auth_1.authorizeRoles)('admin', 'manager'), field_controller_1.deleteField);
exports.default = router;
//# sourceMappingURL=field.routes.js.map