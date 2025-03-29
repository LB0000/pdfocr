import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';

// 環境変数の読み込み
dotenv.config();

// アプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートの設定
app.use('/api', routes);

// エラーハンドリングミドルウェア
app.use(errorHandler);

// データベース接続とサーバー起動
AppDataSource.initialize()
  .then(() => {
    console.log('データベース接続が確立されました');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('データベース接続エラー:', error);
  });

export default app;
