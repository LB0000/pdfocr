import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: Error & { status?: number; code?: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  // エラーステータスコードの設定（デフォルトは500）
  const statusCode = err.status || 500;
  
  // エラーレスポンスの作成
  const errorResponse = {
    error: {
      message: err.message || 'サーバー内部エラーが発生しました',
      code: err.code || 'INTERNAL_SERVER_ERROR',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  };

  // エラーレスポンスの送信
  res.status(statusCode).json(errorResponse);
}
