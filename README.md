# PDF2MD拡張システム

PDF2MD拡張システムは、既存のPDF2MDシステムを拡張し、高度なOCR機能、帳票レイアウト解析、管理ポータル、機械学習補正システムなどを追加することで、業務効率の大幅な向上を実現するプロジェクトです。

## 概要

既存のPDF2MDシステムは基本的なOCR機能を提供していますが、本プロジェクトでは以下の機能を追加します：

- **レイアウト解析**: 帳票の種類やフィールド位置を学習・管理し、各欄のデータを抽出
- **認識精度向上**: 機械学習やフィールド属性設定を用いてOCRの誤認識を減らす
- **管理ポータル**: 認識結果を可視化し、ユーザーが補正・承認できる仕組みを提供
- **学習の蓄積**: ユーザーによる修正結果をフィードバックし、認識精度を継続的に向上

## リポジトリ構成

```
pdf2md-enhanced/
├── docs/                      # ドキュメント
│   ├── architecture/          # アーキテクチャ設計
│   │   └── system_architecture.md
│   ├── modules/               # モジュール設計
│   │   ├── layout_analysis.md
│   │   ├── management_portal.md
│   │   └── ml_correction_system.md
│   └── planning/              # 計画ドキュメント
│       ├── integration_test_plan.md
│       ├── implementation_plan.md
│       └── final_proposal.md
├── src/                       # ソースコード（開発時に追加）
│   ├── backend/               # バックエンドコード
│   ├── frontend/              # フロントエンドコード
│   ├── layout-analysis/       # レイアウト解析モジュール
│   └── ml-correction/         # 機械学習補正システム
├── tests/                     # テストコード（開発時に追加）
├── .gitignore                 # Git除外設定
├── LICENSE                    # ライセンス情報
└── README.md                  # 本ファイル
```

## 主要ドキュメント

### アーキテクチャ設計

- [システムアーキテクチャ](docs/architecture/system_architecture.md) - 全体システム構成、データベース設計、APIエンドポイント設計

### モジュール設計

- [レイアウト解析モジュール](docs/modules/layout_analysis.md) - 帳票テンプレート管理、自動レイアウト判定、フィールド抽出
- [管理ポータル](docs/modules/management_portal.md) - ダッシュボード、認識結果プレビュー・補正UI、検索・フィルタ機能
- [機械学習補正システム](docs/modules/ml_correction_system.md) - OCR補正モデル、正規表現・辞書補完、学習データ管理

### 計画ドキュメント

- [統合・テスト計画](docs/planning/integration_test_plan.md) - コンポーネント統合、テスト戦略、段階的リリース計画
- [実装計画](docs/planning/implementation_plan.md) - 技術スタック選定、開発ロードマップ、リソース要件、リスク管理
- [最終提案書](docs/planning/final_proposal.md) - プロジェクト概要、メリット、ROI分析、次のステップ

## 技術スタック

- **バックエンド**: Node.js + Express.js（TypeScript）
- **フロントエンド**: React + Next.js（TypeScript）
- **データベース**: PostgreSQL + TypeORM
- **キャッシュ/キュー**: Redis + Bull.js
- **OCR/ML**: Mistral AI API + TensorFlow.js
- **インフラ**: Docker + Kubernetes + AWS

## 開発環境セットアップ（開発開始時に追加）

```bash
# リポジトリのクローン
git clone https://github.com/your-organization/pdf2md-enhanced.git
cd pdf2md-enhanced

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 開発ロードマップ

開発は以下の6フェーズで段階的に進めます：

1. **フェーズ1: 基盤構築** (4週間) - 開発環境、データベース、API基盤、認証システム
2. **フェーズ2: 管理ポータル** (6週間) - 認識結果プレビュー・補正UI、ドキュメント管理
3. **フェーズ3: レイアウト解析** (6週間) - テンプレート管理、自動レイアウト判定、フィールド抽出
4. **フェーズ4: 機械学習補正** (8週間) - 基本補正機能、学習データ管理、OCR補正モデル
5. **フェーズ5: 統合・最適化** (4週間) - コンポーネント統合、パフォーマンス最適化、セキュリティ強化
6. **フェーズ6: テスト・展開** (4週間) - システムテスト、パイロット運用、本番展開

## ライセンス

このプロジェクトは [ライセンス名] のもとで公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 貢献

プロジェクトへの貢献方法については、[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。（開発開始時に追加）
