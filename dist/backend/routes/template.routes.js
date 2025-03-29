"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const template_controller_1 = require("../controllers/template.controller");
const router = (0, express_1.Router)();
// すべてのテンプレートルートで認証を要求
router.use(auth_1.authenticateJWT);
// テンプレート一覧の取得
router.get('/', template_controller_1.getAllTemplates);
// 特定のテンプレートの取得
router.get('/:id', template_controller_1.getTemplateById);
// テンプレートの作成（管理者またはマネージャーのみ）
router.post('/', (0, auth_1.authorizeRoles)('admin', 'manager'), template_controller_1.createTemplate);
// テンプレートの更新（管理者またはマネージャーのみ）
router.put('/:id', (0, auth_1.authorizeRoles)('admin', 'manager'), template_controller_1.updateTemplate);
// テンプレートの削除（管理者またはマネージャーのみ）
router.delete('/:id', (0, auth_1.authorizeRoles)('admin', 'manager'), template_controller_1.deleteTemplate);
// デフォルトテンプレートの設定（管理者またはマネージャーのみ）
router.patch('/:id/default', (0, auth_1.authorizeRoles)('admin', 'manager'), template_controller_1.setDefaultTemplate);
exports.default = router;
//# sourceMappingURL=template.routes.js.map