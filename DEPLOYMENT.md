# PDF2MD拡張システム - デプロイガイド

このドキュメントでは、PDF2MD拡張システムのデプロイ手順について説明します。

## 前提条件

- Node.js 18.x以上
- PostgreSQL 14.x以上
- Docker および Docker Compose（オプション）
- NPM または Yarn

## 環境変数の設定

### バックエンド環境変数 (.env)

```
# データベース設定
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=pdf2md_enhanced

# JWT設定
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# サーバー設定
PORT=3001
NODE_ENV=production

# OCR API設定
OCR_API_KEY=your_ocr_api_key
OCR_API_URL=https://api.ocr-service.com
```

### フロントエンド環境変数 (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=PDF2MD拡張システム
```

## デプロイ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-organization/pdf2md-enhanced.git
cd pdf2md-enhanced
```

### 2. バックエンドのデプロイ

#### 依存関係のインストール

```bash
cd src/backend
npm install --production
```

#### データベースのセットアップ

```bash
npm run migration:run
```

#### サーバーの起動

```bash
npm run build
npm run start:prod
```

### 3. フロントエンドのデプロイ

#### 依存関係のインストール

```bash
cd src/frontend
npm install
```

#### ビルドと起動

```bash
npm run build
npm run start
```

### 4. Docker を使用したデプロイ（推奨）

```bash
docker-compose up -d
```

## 本番環境の設定

### Nginx の設定例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL の設定（Let's Encrypt）

```bash
sudo certbot --nginx -d your-domain.com
```

## スケーリング

### 水平スケーリング

バックエンドサーバーを複数インスタンス起動し、ロードバランサーを使用して負荷を分散します。

### 垂直スケーリング

サーバーのリソース（CPU、メモリ）を増強します。

## モニタリングとログ

### ログの設定

- Winston や Pino などのロギングライブラリを使用
- ログローテーションの設定
- 重要なイベントのアラート設定

### パフォーマンスモニタリング

- New Relic や Datadog などのモニタリングツールの導入
- CPU、メモリ、ディスク使用率の監視
- API レスポンスタイムの監視

## バックアップと復元

### データベースバックアップ

```bash
pg_dump -U postgres -d pdf2md_enhanced > backup.sql
```

### バックアップの自動化

cron ジョブを使用して定期的なバックアップを設定します。

```
0 2 * * * pg_dump -U postgres -d pdf2md_enhanced > /backups/pdf2md_$(date +\%Y\%m\%d).sql
```

## トラブルシューティング

### 一般的な問題

1. **データベース接続エラー**
   - 環境変数の確認
   - PostgreSQL サービスの状態確認
   - ファイアウォール設定の確認

2. **API エラー**
   - ログの確認
   - ネットワーク接続の確認
   - 環境変数の確認

3. **フロントエンドの表示問題**
   - ブラウザのコンソールエラーの確認
   - API エンドポイントの確認
   - CORS 設定の確認

## セキュリティ対策

- 定期的なセキュリティアップデート
- 脆弱性スキャンの実施
- 適切なアクセス制御の設定
- HTTPS の強制
- レート制限の設定

## 更新手順

```bash
git pull
cd src/backend
npm install
npm run build
npm run migration:run
pm2 restart backend

cd ../frontend
npm install
npm run build
pm2 restart frontend
```

## 連絡先

問題が発生した場合は、以下の連絡先にお問い合わせください：

- 技術サポート: support@your-company.com
- 緊急連絡先: emergency@your-company.com
