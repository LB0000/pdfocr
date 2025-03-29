"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./config/data-source");
const routes_1 = __importDefault(require("./routes"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// 環境変数の読み込み
dotenv.config();
// データベース接続の初期化
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('データベース接続が確立されました');
    // Expressアプリケーションの作成
    const app = (0, express_1.default)();
    const PORT = process.env.PORT || 3001;
    // ミドルウェアの設定
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // アップロードディレクトリの作成
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!require('fs').existsSync(uploadsDir)) {
        require('fs').mkdirSync(uploadsDir, { recursive: true });
    }
    // 静的ファイルの提供
    app.use('/uploads', express_1.default.static(uploadsDir));
    // ルートの設定
    app.use('/api', routes_1.default);
    // サーバーの起動
    app.listen(PORT, () => {
        console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('データベース接続エラー:', error);
});
//# sourceMappingURL=index.js.map