# PDF to Markdown

このアプリケーションは、PDF ファイルをアップロードし、Mistral AI の OCR 機能を使って内容を解析するためのツールです。

## Mistral AI API キーの取得

1. [Mistral AI](https://mistral.ai/)にアクセスしてアカウントを作成またはログインします
2. ダッシュボードから API キーを生成します
3. 生成された API キーを安全に保管してください

## Vercel Blob の設定

アプリケーションをデプロイする前に、Vercel Blob ストレージを設定する必要があります：

1. **Vercel プロジェクトを作成する**

   - [Vercel](https://vercel.com/) にアクセスしてサインアップ／ログイン
   - 「New Project」をクリックして新しいプロジェクトを作成

2. **Vercel Blob ストアを作成する**

   - プロジェクトダッシュボードの「Storage」タブを選択
   - 「Connect Database」ボタンをクリック
   - 「Create New」タブで「Blob」を選択し、「Continue」ボタンをクリック
   - 以下の設定を行います：
     - 名前：任意の名前（例：「PDF Storage」）
     - 「Create a new Blob store」を選択
     - 環境変数を追加したい環境を選択（通常は全ての環境）
     - 必要に応じて「Advanced Options」で環境変数のプレフィックスを変更可能
   - 「Create」ボタンをクリックしてストアを作成

3. **環境変数の設定**

   - Blob ストアが作成されると、自動的に以下の環境変数がプロジェクトに追加されます：
     - `BLOB_READ_WRITE_TOKEN`
   - ローカル開発環境でこの環境変数を使用するには、Vercel CLI を使って環境変数をプルします：
     ```bash
     vercel env pull
     ```

これらの設定が完了したら、アプリケーションのデプロイに進むことができます。

## Vercel へのデプロイ手順

このアプリケーションを Vercel にデプロイするには、以下の手順に従ってください：

1. **リポジトリをクローンする**

   ```bash
   git clone https://github.com/link2004/pdf2md.git
   cd pdf2md
   ```

2. **.env.example ファイルをコピーする**

   ```bash
   cp .env.example .env
   ```

3. **.env ファイルに必要な環境変数を設定する**

   - Vercel ダッシュボードから`BLOB_READ_WRITE_TOKEN`を取得し設定
   - Mistral AI のアカウントから`MISTRAL_API_KEY`を取得し設定

   ```
   MISTRAL_API_KEY=your_mistral_api_key
   BLOB_READ_WRITE_TOKEN=your_blob_read_write_token
   ```

4. **Vercel にデプロイする**

   - [Vercel](https://vercel.com)にログインまたはアカウント作成
   - 「New Project」をクリック
   - GitHub からリポジトリをインポート
   - 「Environment Variables」セクションで、`.env`ファイルと同じ環境変数を追加
   - 「Deploy」ボタンをクリック

5. **デプロイの確認**
   - デプロイが完了したら、表示される URL にアクセスしてアプリケーションが正常に動作していることを確認

注意: 環境変数は機密情報を含むため、`.env`ファイルは GitHub などの公開リポジトリにコミットしないでください。代わりに、Vercel のダッシュボード上で直接環境変数を設定してください。

## 機能

- PDF ファイルのアップロード
- Vercel Blob ストレージへの PDF の保存
- Mistral AI の OCR 機能を使用した PDF の解析
- 解析結果の表示と編集
- マークダウン形式でのエクスポート機能

## 環境設定

以下の環境変数を`.env.local`ファイルに設定してください：

```
# Vercel Blob設定
BLOB_READ_WRITE_TOKEN=your_blob_read_write_token

# Mistral AI設定
MISTRAL_API_KEY=your_mistral_api_key
```

## 必要な環境

- Node.js 18 以上
- Vercel アカウント（Blob ストア設定済み）
- Mistral AI のアカウントと API キー

## インストール方法

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 技術スタック

- Next.js
- TypeScript
- Vercel Blob（ストレージ）
- Mistral AI（OCR 処理）
- TailwindCSS（スタイリング）
- React Markdown（マークダウンレンダリング）

## トラブルシューティング

- **PDF のアップロードができない場合**

  - ファイルサイズが 20MB 以下であることを確認してください（サーバーアップロードの場合）
  - ブラウザのキャッシュをクリアしてみてください

- **解析が失敗する場合**

  - PDF が暗号化されていないか確認してください
  - スキャンされた PDF の場合、画像品質が十分かチェックしてください

- **API エラーが表示される場合**
  - 環境変数が正しく設定されているか確認してください
  - Mistral API キーの有効期限や利用制限を確認してください
  - Vercel Blob トークンが有効であることを確認してください

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は[LICENSE](./LICENSE)ファイルをご覧ください。