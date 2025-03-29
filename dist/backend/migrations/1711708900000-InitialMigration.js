"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1711708900000 = void 0;
class InitialMigration1711708900000 {
    constructor() {
        this.name = 'InitialMigration1711708900000';
    }
    async up(queryRunner) {
        // ユーザーテーブル
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" varchar PRIMARY KEY,
                "name" varchar(100) NOT NULL,
                "email" varchar(100) NOT NULL UNIQUE,
                "password_hash" varchar(255) NOT NULL,
                "role" varchar(20) NOT NULL DEFAULT 'user',
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
        // ドキュメントテンプレートテーブル
        await queryRunner.query(`
            CREATE TABLE "document_templates" (
                "id" varchar PRIMARY KEY,
                "name" varchar(100) NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT 1,
                "user_id" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("user_id") REFERENCES "users" ("id")
            )
        `);
        // フィールド定義テーブル
        await queryRunner.query(`
            CREATE TABLE "field_definitions" (
                "id" varchar PRIMARY KEY,
                "name" varchar(100) NOT NULL,
                "description" text,
                "position" text,
                "field_type" varchar NOT NULL DEFAULT 'text',
                "validation_rules" text,
                "display_order" integer,
                "template_id" varchar NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("template_id") REFERENCES "document_templates" ("id") ON DELETE CASCADE
            )
        `);
        // ドキュメントテーブル
        await queryRunner.query(`
            CREATE TABLE "documents" (
                "id" varchar PRIMARY KEY,
                "file_name" varchar(255) NOT NULL,
                "description" text,
                "original_file_path" text,
                "processed_file_path" text,
                "status" varchar NOT NULL DEFAULT 'pending',
                "ocr_result" text,
                "layout_analysis_result" text,
                "confidence_score" real NOT NULL DEFAULT 0,
                "template_id" varchar,
                "uploaded_by" varchar NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("template_id") REFERENCES "document_templates" ("id"),
                FOREIGN KEY ("uploaded_by") REFERENCES "users" ("id")
            )
        `);
        // 修正ログテーブル
        await queryRunner.query(`
            CREATE TABLE "correction_logs" (
                "id" varchar PRIMARY KEY,
                "document_id" varchar NOT NULL,
                "field_id" varchar,
                "original_text" text NOT NULL,
                "corrected_text" text NOT NULL,
                "user_id" varchar NOT NULL,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE CASCADE,
                FOREIGN KEY ("field_id") REFERENCES "field_definitions" ("id"),
                FOREIGN KEY ("user_id") REFERENCES "users" ("id")
            )
        `);
        // 学習モデルテーブル
        await queryRunner.query(`
            CREATE TABLE "learning_models" (
                "id" varchar PRIMARY KEY,
                "model_name" varchar(100) NOT NULL,
                "version" varchar(50) NOT NULL,
                "accuracy" real,
                "training_date" datetime,
                "is_active" boolean NOT NULL DEFAULT 0,
                "model_path" varchar(255),
                "created_by" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("created_by") REFERENCES "users" ("id")
            )
        `);
        // ドキュメントフィールドテーブル
        await queryRunner.query(`
            CREATE TABLE "document_fields" (
                "id" varchar PRIMARY KEY,
                "document_id" varchar NOT NULL,
                "field_id" varchar NOT NULL,
                "value" text,
                "original_value" text,
                "confidence" real,
                "is_validated" boolean NOT NULL DEFAULT 0,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE CASCADE,
                FOREIGN KEY ("field_id") REFERENCES "field_definitions" ("id") ON DELETE CASCADE
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "document_fields"`);
        await queryRunner.query(`DROP TABLE "learning_models"`);
        await queryRunner.query(`DROP TABLE "correction_logs"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "field_definitions"`);
        await queryRunner.query(`DROP TABLE "document_templates"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialMigration1711708900000 = InitialMigration1711708900000;
//# sourceMappingURL=1711708900000-InitialMigration.js.map