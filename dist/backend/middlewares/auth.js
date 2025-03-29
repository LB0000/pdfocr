"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT認証ミドルウェア
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: { message: '認証トークンがありません', code: 'AUTH_TOKEN_MISSING' } });
    }
    const token = authHeader.split(' ')[1];
    try {
        const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = {
            id: payload.userId,
            role: payload.role
        };
        next();
    }
    catch (error) {
        return res.status(403).json({ error: { message: '無効または期限切れのトークンです', code: 'INVALID_TOKEN' } });
    }
};
exports.authenticateJWT = authenticateJWT;
// ロールベースのアクセス制御ミドルウェア
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: { message: '認証が必要です', code: 'AUTH_REQUIRED' } });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.js.map