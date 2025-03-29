import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

// JWTペイロードの型定義
interface JwtPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// リクエストにユーザー情報を追加するための拡張
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// JWT認証ミドルウェア
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: { message: '認証トークンがありません', code: 'AUTH_TOKEN_MISSING' } });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    
    req.user = {
      id: payload.userId,
      role: payload.role
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ error: { message: '無効または期限切れのトークンです', code: 'INVALID_TOKEN' } });
  }
};

// ロールベースのアクセス制御ミドルウェア
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { message: '認証が必要です', code: 'AUTH_REQUIRED' } });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }

    next();
  };
};
