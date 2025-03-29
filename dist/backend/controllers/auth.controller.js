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
exports.login = exports.register = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
// ユーザー登録
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // 入力検証
        if (!name || !email || !password) {
            return res.status(400).json({ message: '名前、メールアドレス、パスワードは必須です' });
        }
        // 既存ユーザーの確認
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'このメールアドレスは既に登録されています' });
        }
        // パスワードのハッシュ化
        const passwordHash = await bcrypt.hash(password, 10);
        // ユーザーの作成
        const user = new User_1.User();
        user.name = name;
        user.email = email;
        user.passwordHash = passwordHash;
        user.role = 'user';
        await userRepository.save(user);
        // レスポンス（パスワードハッシュを除外）
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    }
    catch (error) {
        console.error('ユーザー登録エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.register = register;
// ログイン
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 入力検証
        if (!email || !password) {
            return res.status(400).json({ message: 'メールアドレスとパスワードは必須です' });
        }
        // ユーザーの検索
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
        }
        // パスワードの検証
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
        }
        // JWTトークンの生成
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' });
        // レスポンス（パスワードハッシュを除外）
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.status(200).json({
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        console.error('ログインエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map