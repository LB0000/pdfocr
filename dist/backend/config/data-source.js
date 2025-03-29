"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// 環境変数の読み込み
dotenv_1.default.config();
// エンティティのパス
const entitiesPath = path_1.default.join(__dirname, '..', 'entities', '*.ts');
// データソースの設定
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: process.env.SQLITE_DATABASE || path_1.default.join(__dirname, '..', '..', '..', 'pdf2md.sqlite'),
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: [entitiesPath],
    migrations: [path_1.default.join(__dirname, '..', 'migrations', '*.ts')],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map