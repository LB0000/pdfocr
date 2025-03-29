import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // ヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const token = authHeader.split(' ')[1];
    
    // トークンの検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    // リクエストオブジェクトにユーザー情報を追加
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('認証エラー:', error);
    return res.status(401).json({ message: '無効なトークンです' });
  }
};
