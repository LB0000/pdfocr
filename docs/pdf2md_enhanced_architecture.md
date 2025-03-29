# PDF2MD拡張システム アーキテクチャ設計書

## 1. システム全体構成

### 1.1 アーキテクチャ概要

PDF2MD拡張システムは、既存のPDF2MDシステムを基盤としつつ、高度なOCR機能、レイアウト解析、管理画面、学習機能などを追加した統合システムです。全体は以下のコンポーネントで構成されます：

1. **フロントエンド**
   - 管理ポータル（ダッシュボード、認識結果プレビュー・補正UI、帳票テンプレート管理）
   - 既存のPDFアップロード・OCR結果表示機能

2. **バックエンド**
   - OCR処理サービス（既存のMistral AI連携を拡張）
   - レイアウト解析エンジン（新規）
   - 機械学習補正システム（新規）
   - API層（認証・認可、データアクセス）

3. **データストア**
   - ドキュメントストレージ（既存のVercel Blob）
   - リレーショナルデータベース（帳票テンプレート、フィールド定義、ユーザー情報）
   - 学習データストア（修正履歴、モデル管理）

4. **バッチ処理**
   - 機械学習モデル再学習ジョブ
   - データバックアップ・クリーンアップ

### 1.2 システム構成図

```
┌─────────────────────────────────────────────────────────────────┐
│                      クライアント（ブラウザ）                      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                      フロントエンド（Next.js）                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  PDFアップロード  │  │  管理ポータル   │  │ テンプレート管理 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                       バックエンドAPI（Node.js）                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   認証・認可    │  │  データアクセス  │  │   API Gateway   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└───┬───────────────────────┬───────────────────────┬─────────────┘
    │                       │                       │
┌───▼───────────┐   ┌───────▼───────────┐   ┌───────▼───────────┐
│  OCR処理サービス │   │ レイアウト解析エンジン │   │ 機械学習補正システム │
│ (Mistral AI連携) │   │    (新規開発)    │   │    (新規開発)    │
└───┬───────────┘   └───────┬───────────┘   └───────┬───────────┘
    │                       │                       │
┌───▼───────────────────────▼───────────────────────▼───────────┐
│                         データストア                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Vercel Blob    │  │   PostgreSQL    │  │  学習データストア  │  │
│  │  (ドキュメント)  │  │ (メタデータ/設定) │  │  (修正履歴等)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 技術スタック

既存のPDF2MDシステムとの互換性を考慮し、以下の技術スタックを採用します：

- **フロントエンド**
  - Next.js（既存）
  - TypeScript（既存）
  - React（既存）
  - TailwindCSS（既存）
  - React Query（新規：APIデータ管理）
  - React Hook Form（新規：フォーム管理）

- **バックエンド**
  - Node.js（既存）
  - Express.js（新規：APIサーバー）
  - TypeScript（既存）
  - Prisma（新規：ORMツール）

- **データベース**
  - PostgreSQL（新規：リレーショナルデータベース）
  - Vercel Blob（既存：ドキュメントストレージ）
  - Redis（新規：キャッシュ、ジョブキュー）

- **機械学習・AI**
  - Mistral AI API（既存：OCR基盤）
  - TensorFlow.js / ONNX Runtime（新規：クライアントサイド推論）
  - Python + scikit-learn（新規：サーバーサイド学習）

- **インフラ**
  - Vercel（既存：フロントエンドホスティング）
  - Docker + Kubernetes（新規：バックエンドサービス）
  - AWS S3 / Azure Blob（新規：大容量ストレージ、Vercel Blobの代替オプション）

## 2. データベース設計

### 2.1 エンティティ関連図（ER図）

主要なエンティティとその関連を以下に示します：

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     User      │       │   Document    │       │  Template     │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │       │ id            │       │ id            │
│ name          │       │ name          │1    * │ name          │
│ email         │       │ uploadedAt    ├───────┤ description   │
│ role          │       │ status        │       │ createdAt     │
│ createdAt     │       │ blobUrl       │       │ updatedAt     │
└───────┬───────┘       │ userId        │       │ userId        │
        │               │ templateId    │       └───────┬───────┘
        │               └───────┬───────┘               │
        │                       │                       │
        │               ┌───────▼───────┐       ┌───────▼───────┐
        │               │    Page       │       │    Field      │
        │               ├───────────────┤       ├───────────────┤
        │               │ id            │       │ id            │
        │               │ documentId    │       │ templateId    │
        │               │ pageNumber    │       │ name          │
        │               │ imageUrl      │       │ type          │
        │               │ ocrText       │       │ x             │
        │               │ markdown      │       │ y             │
        └───────────────┤ userId        │       │ width         │
                        └───────┬───────┘       │ height        │
                                │               │ validationRule│
                                │               └───────┬───────┘
                                │                       │
                        ┌───────▼───────┐       ┌───────▼───────┐
                        │  Correction   │       │ FieldValue    │
                        ├───────────────┤       ├───────────────┤
                        │ id            │       │ id            │
                        │ pageId        │       │ documentId    │
                        │ originalText  │       │ fieldId       │
                        │ correctedText │       │ value         │
                        │ userId        │       │ confidence    │
                        │ createdAt     │       │ isValidated   │
                        │ fieldId       │       │ correctionId  │
                        └───────────────┘       └───────────────┘
```

### 2.2 テーブル定義

#### Users テーブル
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Documents テーブル
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, completed, error
  blob_url VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  template_id INTEGER REFERENCES templates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Templates テーブル
```sql
CREATE TABLE templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Fields テーブル
```sql
CREATE TABLE fields (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- text, number, date, postal_code, etc.
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  validation_rule TEXT, -- JSON形式で検証ルールを格納
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Pages テーブル
```sql
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  ocr_text TEXT,
  markdown TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### FieldValues テーブル
```sql
CREATE TABLE field_values (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  value TEXT,
  original_value TEXT,
  confidence FLOAT,
  is_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Corrections テーブル
```sql
CREATE TABLE corrections (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
  field_id INTEGER REFERENCES fields(id),
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### ModelVersions テーブル
```sql
CREATE TABLE model_versions (
  id SERIAL PRIMARY KEY,
  model_name VARCHAR(100) NOT NULL,
  version VARCHAR(50) NOT NULL,
  accuracy FLOAT,
  training_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT false,
  model_path VARCHAR(255),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 3. APIエンドポイント設計

### 3.1 認証・認可API

```
POST   /api/auth/login            - ユーザーログイン
POST   /api/auth/logout           - ユーザーログアウト
POST   /api/auth/register         - ユーザー登録（管理者のみ）
GET    /api/auth/me               - 現在のユーザー情報取得
PUT    /api/auth/me               - ユーザー情報更新
POST   /api/auth/password/reset   - パスワードリセット
```

### 3.2 ドキュメント管理API

```
POST   /api/documents             - ドキュメントアップロード
GET    /api/documents             - ドキュメント一覧取得
GET    /api/documents/:id         - ドキュメント詳細取得
DELETE /api/documents/:id         - ドキュメント削除
PUT    /api/documents/:id/status  - ドキュメントステータス更新
GET    /api/documents/:id/pages   - ドキュメントのページ一覧取得
GET    /api/documents/:id/export  - ドキュメントエクスポート（CSV/JSON/Excel）
```

### 3.3 OCR・レイアウト解析API

```
POST   /api/ocr/process           - OCR処理実行
POST   /api/ocr/analyze-layout    - レイアウト解析実行
GET    /api/ocr/status/:jobId     - OCR処理ステータス確認
POST   /api/ocr/correct           - OCR結果修正
```

### 3.4 テンプレート管理API

```
POST   /api/templates             - テンプレート作成
GET    /api/templates             - テンプレート一覧取得
GET    /api/templates/:id         - テンプレート詳細取得
PUT    /api/templates/:id         - テンプレート更新
DELETE /api/templates/:id         - テンプレート削除
POST   /api/templates/:id/fields  - テンプレートにフィールド追加
GET    /api/templates/:id/fields  - テンプレートのフィールド一覧取得
PUT    /api/templates/:id/fields/:fieldId - フィールド更新
DELETE /api/templates/:id/fields/:fieldId - フィールド削除
```

### 3.5 学習・モデル管理API

```
POST   /api/ml/train             - モデル学習開始
GET    /api/ml/models            - モデル一覧取得
GET    /api/ml/models/:id        - モデル詳細取得
PUT    /api/ml/models/:id/active - モデルのアクティブ状態切替
GET    /api/ml/stats             - 認識精度統計取得
```

### 3.6 管理・運用API

```
GET    /api/admin/users          - ユーザー一覧取得（管理者のみ）
POST   /api/admin/users          - ユーザー作成（管理者のみ）
PUT    /api/admin/users/:id      - ユーザー更新（管理者のみ）
DELETE /api/admin/users/:id      - ユーザー削除（管理者のみ）
GET    /api/admin/stats          - システム統計情報取得
GET    /api/admin/logs           - システムログ取得
```

## 4. 非機能要件設計

### 4.1 パフォーマンス・スケーラビリティ

#### 処理性能目標
- 単一PDFのOCR処理：平均5秒以内（5ページまで）
- 大量バッチ処理：1時間あたり1,000ページ以上
- API応答時間：95%のリクエストで500ms以内

#### スケーリング戦略
- Kubernetes上でのマイクロサービスアーキテクチャ採用
- OCR処理とレイアウト解析を別サービスとして実装し、独立したスケーリングを実現
- 処理キューを導入し、負荷分散と非同期処理を実現

#### キャッシュ戦略
- Redis活用によるAPIレスポンスキャッシュ
- 頻繁にアクセスされるテンプレートデータのメモリキャッシュ
- 画像処理結果の一時キャッシュ

### 4.2 セキュリティ設計

#### 認証・認可
- JWT（JSON Web Token）ベースの認証
- ロールベースのアクセス制御（RBAC）
  - 管理者：全機能アクセス可能
  - 一般ユーザー：自分のドキュメントのみアクセス可能
  - 閲覧者：読み取り専用アクセス

#### データ保護
- 保存データの暗号化（AES-256）
- 通信の暗号化（TLS 1.3）
- 個人情報を含むフィールドのマスキング機能

#### セキュリティ監視
- ログイン試行の監視と制限
- 異常アクセスパターンの検出
- 定期的な脆弱性スキャン

### 4.3 可用性・信頼性

#### 可用性目標
- システム稼働率：99.9%（月間ダウンタイム約43分以内）
- 計画メンテナンス：月1回、深夜2時間以内

#### バックアップ戦略
- データベース：日次フルバックアップ、1時間ごとの増分バックアップ
- ドキュメントストレージ：日次バックアップ
- バックアップ保持期間：30日間

#### 障害対策
- サービス間の回路遮断（Circuit Breaker）パターン実装
- ヘルスチェックとサービス自動再起動
- 障害検知と自動通知システム

### 4.4 監視・運用

#### 監視指標
- システムリソース（CPU、メモリ、ディスク、ネットワーク）
- アプリケーションメトリクス（リクエスト数、エラー率、レスポンスタイム）
- ビジネスメトリクス（処理ドキュメント数、OCR精度、ユーザー数）

#### アラート設定
- クリティカルアラート：即時通知（Slack、メール）
- 警告アラート：営業時間内通知
- 情報アラート：日次レポート

#### ログ管理
- 集中ログ収集（ELK Stack）
- ログ保持期間：システムログ90日、監査ログ1年
- ログローテーション：日次、圧縮保存

## 5. 拡張機能詳細設計

### 5.1 レイアウト解析エンジン

レイアウト解析エンジンは、OCR処理後のテキストと位置情報を利用して、帳票の種類を自動判別し、各フィールドの位置を特定します。

#### 主要コンポーネント
1. **テンプレートマッチングモジュール**
   - 特徴点抽出によるテンプレート照合
   - キーワードベースのドキュメント分類

2. **フィールド検出モジュール**
   - 矩形領域検出アルゴリズム
   - テキストブロックのグルーピング

3. **自動テンプレート生成モジュール**
   - 未知の帳票からの半自動テンプレート生成
   - 類似テンプレートの提案機能

#### 処理フロー
1. OCR処理結果（テキスト＋位置情報）を入力として受け取る
2. 既存テンプレートとのマッチング試行
3. マッチング成功時：対応するフィールド定義に基づきデータ抽出
4. マッチング失敗時：新規テンプレート候補として管理者に通知

### 5.2 機械学習補正システム

機械学習補正システムは、OCRの誤認識を減らすための複数の補正アルゴリズムを提供します。

#### 主要コンポーネント
1. **文字認識補正モデル**
   - 誤認識しやすい文字パターンの学習
   - コンテキストベースの文字補正

2. **フィールド属性ベース検証**
   - 日付、金額、郵便番号などの形式検証
   - 正規表現マッチングと候補提示

3. **辞書補完エンジン**
   - 人名、地名、専門用語の辞書照合
   - 編集距離に基づく類似度計算

4. **相関チェックエンジン**
   - 同一文書内の重複データ検証
   - 関連フィールド間の整合性チェック

#### 学習フロー
1. ユーザーによる修正データを収集
2. 定期的（または一定量達成時）にモデル再学習
3. 新旧モデルの精度比較評価
4. 管理者承認後に本番モデル更新

### 5.3 管理ポータル

管理ポータルは、OCR結果の確認・修正、帳票テンプレート管理、システム運用管理のためのWebインターフェースを提供します。

#### 主要画面
1. **ダッシュボード**
   - 処理状況サマリー（待機中、処理中、完了、エラー）
   - 最近の処理履歴
   - システムパフォーマンス指標

2. **ドキュメント管理**
   - ドキュメント一覧（検索・フィルタ機能付き）
   - ステータス管理
   - バッチ処理機能

3. **認識結果プレビュー・補正**
   - 原本画像と認識テキストの並列表示
   - インラインテキスト編集
   - フィールド単位の修正履歴

4. **テンプレート管理**
   - テンプレート一覧
   - ビジュアルエディタ（フィールド位置・サイズ編集）
   - フィールド属性設定

5. **ユーザー管理**
   - ユーザー一覧
   - 権限設定
   - アクティビティログ

6. **システム設定**
   - OCRエンジン設定
   - 学習モデル管理
   - バックアップ・復元

#### UI/UX設計原則
- レスポンシブデザイン（デスクトップ優先、タブレット対応）
- キーボードショートカットによる効率的な操作
- バッチ処理とリアルタイム処理の明確な分離
- エラー状態の視覚的フィードバック
- 処理の進行状況の可視化

## 6. 実装ロードマップ

### フェーズ1: 基盤構築（2ヶ月）
- データベース設計・実装
- APIサーバー基盤構築
- 認証・認可システム実装
- 既存PDF2MDとの統合

### フェーズ2: コア機能実装（3ヶ月）
- レイアウト解析エンジン開発
- 管理ポータル基本機能実装
- テンプレート管理機能実装
- OCR結果プレビュー・補正UI実装

### フェーズ3: 高度機能実装（2ヶ月）
- 機械学習補正システム開発
- 辞書補完機能実装
- 相関チェック機能実装
- バッチ処理システム実装

### フェーズ4: 統合・最適化（1ヶ月）
- パフォーマンス最適化
- セキュリティ強化
- 大規模テスト
- ドキュメント整備

### フェーズ5: パイロット運用（1ヶ月）
- 限定ユーザーによる試験運用
- フィードバック収集・改善
- 運用手順確立
- 本番環境準備

## 7. リスクと対策

### 技術的リスク
1. **OCR精度の限界**
   - 対策: 複数のOCRエンジンの併用検討、前処理フィルタの強化

2. **大規模データ処理のパフォーマンス**
   - 対策: 早期からの負荷テスト実施、スケーラブルなアーキテクチャ設計

3. **機械学習モデルの過学習**
   - 対策: 交差検証の徹底、定期的な評価指標モニタリング

### プロジェクト管理リスク
1. **スコープクリープ**
   - 対策: 明確な要件定義と優先順位付け、段階的リリース計画

2. **技術的負債の蓄積**
   - 対策: コードレビュー体制の確立、定期的なリファクタリング

3. **チームのスキルギャップ**
   - 対策: 早期からのトレーニング計画、外部専門家の活用

### 運用リスク
1. **システム障害時の業務影響**
   - 対策: フェイルオーバー機構の実装、手動処理への切り替え手順整備

2. **データセキュリティ侵害**
   - 対策: 定期的なセキュリティ監査、アクセス制御の厳格化

3. **運用コストの増大**
   - 対策: 自動化の推進、リソース使用量の継続的モニタリング

## 8. まとめ

本アーキテクチャ設計書では、既存のPDF2MDシステムを拡張し、高度なOCR機能、レイアウト解析、管理画面、学習機能などを追加するための全体設計を示しました。

主な拡張ポイントは以下の通りです：

1. **レイアウト解析**: 帳票テンプレート管理と自動認識機能
2. **機械学習補正**: OCR精度向上のための学習型補正システム
3. **管理ポータル**: 効率的な確認・修正のためのUI/UX
4. **スケーラブルなアーキテクチャ**: 大量処理に対応する分散システム設計

この設計に基づき、段階的な実装を進めることで、要件定義書に記載された機能を効率的に実現することが可能です。また、将来的な拡張性も考慮した設計となっており、多言語対応やモバイル最適化などの追加要件にも対応可能です。
