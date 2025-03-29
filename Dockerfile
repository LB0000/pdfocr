FROM node:20-alpine

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# アプリケーションのコピー
COPY . .

# TypeScriptのビルド
RUN npm run build

# アプリケーションの起動
CMD ["npm", "start"]
