"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.uploadDocument = exports.getDocumentById = exports.getAllDocuments = void 0;
const data_source_1 = require("../config/data-source");
const Document_1 = require("../entities/Document");
const User_1 = require("../entities/User");
const fs = __importStar(require("fs"));
const documentRepository = data_source_1.AppDataSource.getRepository(Document_1.Document);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
// すべてのドキュメントを取得
const getAllDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const documents = await documentRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
        res.status(200).json(documents);
    }
    catch (error) {
        console.error('ドキュメント取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.getAllDocuments = getAllDocuments;
// 特定のドキュメントを取得
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const document = await documentRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['fields']
        });
        if (!document) {
            return res.status(404).json({ message: 'ドキュメントが見つかりません' });
        }
        res.status(200).json(document);
    }
    catch (error) {
        console.error('ドキュメント取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.getDocumentById = getDocumentById;
// ドキュメントをアップロード
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'ファイルが提供されていません' });
        }
        const { name, description } = req.body;
        const userId = req.user.id;
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'ユーザーが見つかりません' });
        }
        const document = new Document_1.Document();
        document.name = name || req.file.originalname;
        document.description = description || '';
        document.filePath = req.file.path;
        document.status = 'pending';
        document.user = user;
        await documentRepository.save(document);
        res.status(201).json(document);
    }
    catch (error) {
        console.error('ドキュメントアップロードエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.uploadDocument = uploadDocument;
// ドキュメントを更新
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        const userId = req.user.id;
        const document = await documentRepository.findOne({
            where: { id, user: { id: userId } }
        });
        if (!document) {
            return res.status(404).json({ message: 'ドキュメントが見つかりません' });
        }
        if (name)
            document.name = name;
        if (description !== undefined)
            document.description = description;
        if (status)
            document.status = status;
        await documentRepository.save(document);
        res.status(200).json(document);
    }
    catch (error) {
        console.error('ドキュメント更新エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.updateDocument = updateDocument;
// ドキュメントを削除
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const document = await documentRepository.findOne({
            where: { id, user: { id: userId } }
        });
        if (!document) {
            return res.status(404).json({ message: 'ドキュメントが見つかりません' });
        }
        // ファイルの削除
        if (document.filePath && fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }
        await documentRepository.remove(document);
        res.status(200).json({ message: 'ドキュメントが削除されました' });
    }
    catch (error) {
        console.error('ドキュメント削除エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=document.controller.js.map