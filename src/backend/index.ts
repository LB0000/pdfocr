import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import routes from './routes';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 環境変数の読み込み
dotenv.config();

// データベース接続の初期化
AppDataSource.initialize()
  .then(() => {
    console.log('データベース接続が確立されました');
    
    // Expressアプリケーションの作成
    const app = express();
    const PORT = process.env.PORT || 3001;
    
    // ミドルウェアの設定
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // アップロードディレクトリの作成
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!require('fs').existsSync(uploadsDir)) {
      require('fs').mkdirSync(uploadsDir, { recursive: true });
    }
    
    // 静的ファイルの提供
    app.use('/uploads', express.static(uploadsDir));
    
    // ルートの設定
    app.use('/api', routes);
    
    // サーバーの起動
    app.listen(PORT, () => {
      console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('データベース接続エラー:', error);
  });
