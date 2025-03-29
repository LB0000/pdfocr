# 機械学習補正システム 詳細設計書

## 1. 概要

機械学習補正システムは、PDF2MD拡張システムのOCR精度向上のための中核コンポーネントとして、機械学習モデル、正規表現・辞書補完、重複チェック・相関チェックなどの機能を提供します。ユーザーの修正データを学習に活用し、継続的に認識精度を向上させる仕組みを構築します。

## 2. 機能要件

### 2.1 OCR補正モデル

#### 2.1.1 文字認識補正
- 誤認識しやすい文字パターンの学習（例：数字の「1」とアルファベットの「I」の区別）
- 文脈に基づく文字列補正（前後の単語から適切な文字を推定）
- 低品質画像からの文字認識精度向上
- フォントバリエーションへの対応

#### 2.1.2 レイアウト認識補正
- 表構造の正確な認識と補正
- 段組みテキストの適切な順序付け
- 回転・傾きのある文書の補正
- 背景ノイズの除去と文字抽出精度向上

#### 2.1.3 学習モデル管理
- モデルのバージョン管理
- A/Bテスト機能（新旧モデルの比較評価）
- モデル性能メトリクスの計測・可視化
- 特定帳票種別に特化したモデルの管理

### 2.2 正規表現・辞書補完機能

#### 2.2.1 フィールド型に基づく補正
- 日付形式の正規化・補正（様々な日付表記を標準形式に変換）
- 数値・金額の正規化（桁区切り、小数点、通貨記号等の処理）
- 郵便番号・電話番号の形式補正（ハイフン位置の補正等）
- メールアドレス・URLの形式検証と補正

#### 2.2.2 辞書参照機能
- 人名辞書（姓名、役職等）
- 地名辞書（都道府県、市区町村、町名等）
- 企業名辞書（会社名、部署名等）
- 専門用語辞書（業界固有用語等）
- ユーザー定義辞書（カスタム辞書登録・管理）

#### 2.2.3 オートコンプリート・候補提示
- 入力途中での候補表示
- 類似文字列の候補提示
- 頻度ベースの候補順序付け
- 文脈に基づく候補フィルタリング

### 2.3 重複チェック・相関チェック機能

#### 2.3.1 ドキュメント内重複チェック
- 同一フィールドの複数箇所出現時の整合性確認
- 類似フィールド間の整合性確認（例：小計と合計の関係）
- 表内データの行列集計値チェック
- 重複検出時の自動修正または警告表示

#### 2.3.2 ドキュメント間相関チェック
- 関連書類間のデータ整合性確認
- 時系列データの連続性チェック
- マスターデータとの整合性確認
- 不整合検出時の処理（警告、自動修正、承認フロー等）

#### 2.3.3 ビジネスルールチェック
- 業務ルールに基づく妥当性検証
- 計算式に基づく値の検証
- 日付範囲・数値範囲の妥当性検証
- カスタムルール定義・管理機能

### 2.4 学習データ管理フロー

#### 2.4.1 修正データ収集
- ユーザー修正内容の自動記録
- 修正前後の差分抽出
- 修正メタデータ（修正者、日時、確信度等）の記録
- プライバシー保護のためのデータ匿名化

#### 2.4.2 学習データ生成
- 修正データからの学習用データセット生成
- データクレンジング・前処理
- データ拡張（回転、スケーリング等によるバリエーション生成）
- 学習・検証・テストデータの分割

#### 2.4.3 モデル学習・更新
- 定期的な再学習スケジュール管理
- インクリメンタル学習（既存モデルの継続的更新）
- 学習プロセスのモニタリング
- モデル評価・検証フロー

#### 2.4.4 フィードバックループ
- モデル性能の継続的評価
- 誤認識パターンの分析
- 改善効果の測定・レポート
- 学習データ品質の管理

## 3. 技術設計

### 3.1 コンポーネント構成

```
┌─────────────────────────────────────────────────────────────────┐
│                  機械学習補正システム                           │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ OCR補正モデル   │  │ 正規表現・辞書  │  │ 学習データ管理   │  │
│  │ コンポーネント  │  │ コンポーネント  │  │ コンポーネント   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                      │
│  │ 重複・相関      │  │ モデル評価      │                      │
│  │ チェック        │  │ コンポーネント  │                      │
│  └─────────────────┘  └─────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.1.1 OCR補正モデルコンポーネント
- 文字認識補正モデル
- レイアウト認識補正モデル
- モデル推論エンジン
- モデルバージョン管理

#### 3.1.2 正規表現・辞書コンポーネント
- 正規表現パターンマッチング
- 辞書検索・照合
- 候補生成・ランキング
- カスタム辞書管理

#### 3.1.3 重複・相関チェックコンポーネント
- ドキュメント内整合性チェック
- ドキュメント間整合性チェック
- ビジネスルール検証
- 不整合検出・通知

#### 3.1.4 学習データ管理コンポーネント
- 修正データ収集
- 学習データセット生成
- データ前処理・拡張
- 学習スケジュール管理

#### 3.1.5 モデル評価コンポーネント
- 性能メトリクス計測
- A/Bテスト実行
- 誤認識分析
- 改善レポート生成

### 3.2 データモデル

#### 3.2.1 OCR補正モデル
```typescript
interface OcrCorrectionModel {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  createdAt: Date;
  updatedAt: Date;
  status: ModelStatus;
  metrics: ModelMetrics;
  parameters: Record<string, any>;
  filePath: string;
  templateIds?: string[]; // 特定テンプレート用モデルの場合
}

enum ModelType {
  CHARACTER_CORRECTION = 'character_correction',
  LAYOUT_CORRECTION = 'layout_correction',
  FIELD_TYPE_SPECIFIC = 'field_type_specific',
  CUSTOM = 'custom'
}

enum ModelStatus {
  TRAINING = 'training',
  TESTING = 'testing',
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix?: Record<string, Record<string, number>>;
  improvementRate?: number; // 前バージョンからの改善率
}
```

#### 3.2.2 辞書モデル
```typescript
interface Dictionary {
  id: string;
  name: string;
  description?: string;
  type: DictionaryType;
  entries: DictionaryEntry[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

enum DictionaryType {
  PERSON_NAME = 'person_name',
  LOCATION = 'location',
  COMPANY = 'company',
  TERMINOLOGY = 'terminology',
  CUSTOM = 'custom'
}

interface DictionaryEntry {
  id: string;
  dictionaryId: string;
  value: string;
  normalizedValue?: string;
  aliases?: string[];
  metadata?: Record<string, any>;
  frequency?: number; // 出現頻度
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3.2.3 修正データモデル
```typescript
interface CorrectionData {
  id: string;
  documentId: string;
  fieldId: string;
  originalValue: string;
  correctedValue: string;
  confidence: number; // OCR信頼度
  correctedBy: string; // ユーザーID
  correctedAt: Date;
  isAutomatic: boolean; // 自動修正かどうか
  correctionType: CorrectionType;
  metadata?: Record<string, any>;
}

enum CorrectionType {
  CHARACTER = 'character',
  FORMAT = 'format',
  LAYOUT = 'layout',
  DICTIONARY = 'dictionary',
  RULE_BASED = 'rule_based',
  MANUAL = 'manual'
}
```

#### 3.2.4 学習データセットモデル
```typescript
interface TrainingDataset {
  id: string;
  name: string;
  description?: string;
  modelId: string;
  createdAt: Date;
  status: DatasetStatus;
  metrics?: DatasetMetrics;
  splitRatio: {
    training: number;
    validation: number;
    test: number;
  };
  dataCount: {
    total: number;
    training: number;
    validation: number;
    test: number;
  };
}

enum DatasetStatus {
  PREPARING = 'preparing',
  READY = 'ready',
  IN_USE = 'in_use',
  ARCHIVED = 'archived'
}

interface DatasetMetrics {
  classDistribution: Record<string, number>;
  dataQualityScore: number;
  coverage: number;
}
```

### 3.3 アルゴリズム設計

#### 3.3.1 文字認識補正アルゴリズム

1. **前処理**
   - OCR結果のテキスト正規化
   - 文字列分割（単語、フレーズ等）
   - 特徴抽出（文字種、長さ、パターン等）

2. **文字レベル補正**
   - 文字混同マトリクスに基づく補正
   - 編集距離に基づく類似文字列検索
   - 文脈を考慮した文字置換

3. **単語レベル補正**
   - 辞書照合による単語補正
   - N-gramモデルによる単語予測
   - 単語の出現頻度に基づく補正

4. **フィールドレベル補正**
   - フィールド型に基づく形式補正
   - ドメイン固有ルールの適用
   - 信頼度スコアリングと閾値判定

#### 3.3.2 学習データ生成アルゴリズム

1. **修正データ収集**
   - ユーザー修正の差分抽出
   - 修正パターンの分類
   - メタデータ付与（修正タイプ、信頼度等）

2. **データ前処理**
   - ノイズ除去・異常値検出
   - 重複排除
   - 匿名化処理

3. **データ拡張**
   - 文字変形（フォント、サイズ、スタイル等）
   - 画像変形（回転、スケーリング、ノイズ追加等）
   - 合成データ生成

4. **データセット分割**
   - 層別サンプリングによるデータ分割
   - クラスバランス調整
   - 交差検証用データセット準備

#### 3.3.3 重複・相関チェックアルゴリズム

1. **ドキュメント内重複検出**
   - 同一フィールド値の検索
   - 類似フィールド値の検索（編集距離、類似度計算）
   - 数値関係の検証（合計、平均等）

2. **ドキュメント間相関検出**
   - キーフィールドによるドキュメント関連付け
   - 時系列データの連続性検証
   - マスターデータとの整合性検証

3. **不整合処理**
   - 信頼度に基づく自動修正
   - 複数候補の生成と提示
   - エスカレーションルールの適用

### 3.4 API設計

#### 3.4.1 OCR補正API

```
POST   /api/ocr/correct                  - OCR結果の補正処理実行
GET    /api/ocr/models                   - 補正モデル一覧取得
POST   /api/ocr/models                   - 新規モデル登録
GET    /api/ocr/models/:id               - モデル詳細取得
PUT    /api/ocr/models/:id               - モデル更新
DELETE /api/ocr/models/:id               - モデル削除
POST   /api/ocr/models/:id/activate      - モデルアクティブ化
POST   /api/ocr/models/:id/test          - モデルテスト実行
GET    /api/ocr/models/:id/metrics       - モデル性能メトリクス取得
```

#### 3.4.2 辞書管理API

```
GET    /api/dictionaries                 - 辞書一覧取得
POST   /api/dictionaries                 - 新規辞書作成
GET    /api/dictionaries/:id             - 辞書詳細取得
PUT    /api/dictionaries/:id             - 辞書更新
DELETE /api/dictionaries/:id             - 辞書削除
GET    /api/dictionaries/:id/entries     - 辞書エントリ一覧取得
POST   /api/dictionaries/:id/entries     - 辞書エントリ追加
PUT    /api/dictionaries/:id/entries/:entryId - 辞書エントリ更新
DELETE /api/dictionaries/:id/entries/:entryId - 辞書エントリ削除
POST   /api/dictionaries/:id/import      - 辞書インポート
GET    /api/dictionaries/:id/export      - 辞書エクスポート
```

#### 3.4.3 学習データ管理API

```
GET    /api/training/datasets            - 学習データセット一覧取得
POST   /api/training/datasets            - 新規データセット作成
GET    /api/training/datasets/:id        - データセット詳細取得
DELETE /api/training/datasets/:id        - データセット削除
POST   /api/training/datasets/:id/generate - データセット生成処理実行
GET    /api/training/datasets/:id/metrics - データセットメトリクス取得
POST   /api/training/jobs                - 学習ジョブ作成
GET    /api/training/jobs                - 学習ジョブ一覧取得
GET    /api/training/jobs/:id            - 学習ジョブ詳細取得
POST   /api/training/jobs/:id/cancel     - 学習ジョブキャンセル
```

#### 3.4.4 検証・評価API

```
POST   /api/validation/check             - 整合性チェック実行
POST   /api/validation/compare-models    - モデル比較テスト実行
GET    /api/validation/error-patterns    - 誤認識パターン分析取得
POST   /api/validation/simulate          - 補正シミュレーション実行
GET    /api/validation/reports           - 評価レポート一覧取得
GET    /api/validation/reports/:id       - 評価レポート詳細取得
```

## 4. 実装計画

### 4.1 フェーズ1: 基本補正機能実装（2週間）
- 正規表現ベースの基本補正機能実装
- 辞書検索・照合機能実装
- フィールド型に基づく形式補正実装
- 基本的な重複・相関チェック実装

### 4.2 フェーズ2: 学習データ管理機能実装（2週間）
- 修正データ収集機能実装
- 学習データセット生成機能実装
- データ前処理・拡張機能実装
- 学習データ管理UI実装

### 4.3 フェーズ3: OCR補正モデル実装（3週間）
- 文字認識補正モデル実装
- レイアウト認識補正モデル実装
- モデル推論エンジン実装
- モデルバージョン管理機能実装

### 4.4 フェーズ4: 高度な検証・評価機能実装（2週間）
- A/Bテスト機能実装
- 性能メトリクス計測・可視化機能実装
- 誤認識パターン分析機能実装
- 改善レポート生成機能実装

### 4.5 フェーズ5: 統合・最適化（1週間）
- パフォーマンス最適化
- エラーハンドリング強化
- ユーザビリティ改善
- ドキュメント整備

## 5. モデル選定と設計

### 5.1 文字認識補正モデル

#### 5.1.1 候補モデル
1. **ルールベースモデル**
   - 混同行列に基づく文字置換
   - 編集距離に基づく類似文字列検索
   - 正規表現パターンマッチング

2. **統計モデル**
   - N-gramモデル
   - 隠れマルコフモデル（HMM）
   - 最大エントロピーモデル

3. **ディープラーニングモデル**
   - LSTM/GRUベースのシーケンスモデル
   - Transformer/BERTベースの言語モデル
   - Vision-Languageハイブリッドモデル

#### 5.1.2 推奨モデル
初期段階では、実装の容易さと既存OCR結果の活用を考慮し、以下の組み合わせを推奨します：

1. **基本補正**: ルールベースモデル + 辞書照合
   - 実装が容易で、特定のパターンに対して高い精度を発揮
   - 少量のデータでも効果を発揮
   - メンテナンスが容易

2. **高度補正**: LSTM/GRUベースのシーケンスモデル
   - 文脈を考慮した補正が可能
   - 十分な学習データが蓄積された後に導入
   - 特に手書き文字や低品質画像に効果的

### 5.2 レイアウト認識補正モデル

#### 5.2.1 候補モデル
1. **ルールベースモデル**
   - テンプレートマッチング
   - 座標ベースのグルーピング
   - ヒューリスティックルール

2. **機械学習モデル**
   - Random Forest/SVMによる分類
   - グラフベースのクラスタリング
   - 条件付き確率場（CRF）

3. **ディープラーニングモデル**
   - CNNベースの領域検出
   - Graph Neural Network
   - LayoutLMなどの特化モデル

#### 5.2.2 推奨モデル
レイアウト認識には、以下の段階的アプローチを推奨します：

1. **基本レイアウト解析**: ルールベースモデル + テンプレートマッチング
   - 定型帳票に対して高い精度
   - 実装が比較的容易
   - テンプレート管理機能と連携

2. **高度レイアウト解析**: LayoutLMベースのモデル
   - 非定型帳票にも対応可能
   - テキストと視覚的レイアウトの両方を考慮
   - 十分な学習データ蓄積後に導入

### 5.3 学習戦略

#### 5.3.1 初期モデル構築
- 既存OCRエンジンの出力と人手による修正データを初期学習データとして活用
- 一般的な誤認識パターンに対するルールを手動で定義
- 基本的な辞書（人名、地名、企業名等）を初期データとして準備

#### 5.3.2 継続的学習
- ユーザーの修正データを自動的に学習データとして蓄積
- 定期的な再学習スケジュール（週次/月次）の設定
- インクリメンタル学習による既存モデルの継続的改善
- 誤認識パターンの分析に基づく重点的な学習データ収集

#### 5.3.3 モデル評価・選定
- 精度、再現率、F1スコア等の標準的な評価指標の測定
- 実際の業務データを用いた実用性評価
- A/Bテストによる新旧モデルの比較
- ユーザーフィードバックの収集・分析

## 6. 技術的課題と対策

### 6.1 データ不足
- **課題**: 初期段階では学習に十分なデータが不足する可能性がある
- **対策**: 
  - ルールベースモデルを初期段階で活用
  - データ拡張技術の活用（回転、スケーリング等）
  - 合成データの生成
  - 転移学習の活用（事前学習済みモデルのファインチューニング）

### 6.2 過学習
- **課題**: 特定のパターンに過度に適応し、汎化性能が低下する可能性
- **対策**:
  - 正則化技術の適用
  - 交差検証による評価
  - データの多様性確保
  - アンサンブル学習の活用

### 6.3 計算リソース
- **課題**: 高度なモデルの学習・推論に大きな計算リソースが必要
- **対策**:
  - モデルの軽量化・最適化
  - バッチ処理とリアルタイム処理の分離
  - クラウドリソースの効率的活用
  - 段階的なモデル導入（簡易→高度）

### 6.4 プライバシー・セキュリティ
- **課題**: 学習データに個人情報や機密情報が含まれる可能性
- **対策**:
  - データ匿名化処理
  - アクセス制御の厳格化
  - 暗号化技術の活用
  - データ保持期間の最小化

## 7. まとめ

本設計書では、PDF2MD拡張システムの機械学習補正システムについて、機能要件、技術設計、モデル選定、実装計画、技術的課題と対策を詳細に定義しました。

ユーザーからのフィードバックを踏まえ、以下の優先順位で実装を進めます：

1. **基本補正機能**: 正規表現・辞書補完による即効性のある補正機能を優先実装
2. **学習データ管理**: ユーザー修正を効率的に学習データ化する仕組みを構築
3. **OCR補正モデル**: 蓄積されたデータを活用した高度な補正モデルを段階的に導入
4. **検証・評価機能**: モデルの継続的な改善を支援する評価・分析機能を実装

アジャイル開発アプローチを採用し、各フェーズで機能を実装・検証・改善していくことで、開発リスクを低減しながら価値を早期に提供します。特に、正規表現・辞書補完による基本補正機能は、比較的少ない開発リソースで即効性のある精度向上が期待できるため、最優先で実装します。
