import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import routes from './routes';
import path from 'path';
import fs from 'fs';

// アプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// アップロードディレクトリの作成
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 静的ファイルの提供
app.use('/uploads', express.static(uploadsDir));

// ルートパスへのレスポンス追加
app.get('/', (req, res) => {
  res.json({
    message: 'PDF2MD拡張システムAPIサーバーが正常に動作しています',
    version: '0.1.0',
    endpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/documents',
      '/api/templates'
    ]
  });
});

// APIルートの設定
app.use('/api', routes);

// データベース接続とサーバー起動
AppDataSource.initialize()
  .then(() => {
    console.log('データベース接続が確立されました');
    app.listen(PORT, () => {
      console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('データベース接続エラー:', error);
  });
