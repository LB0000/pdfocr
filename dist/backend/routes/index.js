"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_controller_1 = require("../controllers/auth.controller");
const document_controller_1 = require("../controllers/document.controller");
const template_controller_1 = require("../controllers/template.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// 認証ルート
router.post('/auth/register', auth_controller_1.register);
router.post('/auth/login', auth_controller_1.login);
// ドキュメントルート
router.get('/documents', auth_middleware_1.authMiddleware, document_controller_1.getAllDocuments);
router.get('/documents/:id', auth_middleware_1.authMiddleware, document_controller_1.getDocumentById);
router.post('/documents', auth_middleware_1.authMiddleware, upload.single('file'), document_controller_1.uploadDocument);
router.put('/documents/:id', auth_middleware_1.authMiddleware, document_controller_1.updateDocument);
router.delete('/documents/:id', auth_middleware_1.authMiddleware, document_controller_1.deleteDocument);
// テンプレートルート
router.get('/templates', auth_middleware_1.authMiddleware, template_controller_1.getAllTemplates);
router.get('/templates/:id', auth_middleware_1.authMiddleware, template_controller_1.getTemplateById);
router.post('/templates', auth_middleware_1.authMiddleware, template_controller_1.createTemplate);
router.put('/templates/:id', auth_middleware_1.authMiddleware, template_controller_1.updateTemplate);
router.delete('/templates/:id', auth_middleware_1.authMiddleware, template_controller_1.deleteTemplate);
exports.default = router;
//# sourceMappingURL=index.js.map