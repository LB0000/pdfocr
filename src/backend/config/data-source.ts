import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// 環境変数の読み込み
dotenv.config();

// エンティティのパス
const entitiesPath = path.join(__dirname, '..', 'entities', '*.ts');

// データソースの設定
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.SQLITE_DATABASE || path.join(__dirname, '..', '..', '..', 'pdf2md.sqlite'),
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [entitiesPath],
  migrations: [path.join(__dirname, '..', 'migrations', '*.ts')],
  subscribers: [],
});
