"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const document_controller_1 = require("../controllers/document.controller");
const router = (0, express_1.Router)();
// すべてのドキュメントルートで認証を要求
router.use(auth_1.authenticateJWT);
// ドキュメント一覧の取得
router.get('/', document_controller_1.getAllDocuments);
// 特定のドキュメントの取得
router.get('/:id', document_controller_1.getDocumentById);
// ドキュメントのフィールド一覧の取得
router.get('/:id/fields', document_controller_1.getDocumentFields);
// ドキュメントのアップロード
router.post('/upload', document_controller_1.uploadDocument);
// ドキュメントの処理（OCR実行）
router.post('/:id/process', document_controller_1.processDocument);
// ドキュメント情報の更新
router.put('/:id', document_controller_1.updateDocument);
// ドキュメントの削除
router.delete('/:id', document_controller_1.deleteDocument);
exports.default = router;
//# sourceMappingURL=document.routes.js.map