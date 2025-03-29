"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.getTemplateById = exports.getAllTemplates = void 0;
const data_source_1 = require("../config/data-source");
const DocumentTemplate_1 = require("../entities/DocumentTemplate");
const FieldDefinition_1 = require("../entities/FieldDefinition");
const templateRepository = data_source_1.AppDataSource.getRepository(DocumentTemplate_1.DocumentTemplate);
const fieldDefinitionRepository = data_source_1.AppDataSource.getRepository(FieldDefinition_1.FieldDefinition);
// すべてのテンプレートを取得
const getAllTemplates = async (req, res) => {
    try {
        const templates = await templateRepository.find({
            order: { createdAt: 'DESC' }
        });
        res.status(200).json(templates);
    }
    catch (error) {
        console.error('テンプレート取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.getAllTemplates = getAllTemplates;
// 特定のテンプレートを取得
const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await templateRepository.findOne({
            where: { id },
            relations: ['fields']
        });
        if (!template) {
            return res.status(404).json({ message: 'テンプレートが見つかりません' });
        }
        res.status(200).json(template);
    }
    catch (error) {
        console.error('テンプレート取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.getTemplateById = getTemplateById;
// テンプレートを作成
const createTemplate = async (req, res) => {
    try {
        const { name, description, fields } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'テンプレート名は必須です' });
        }
        const template = new DocumentTemplate_1.DocumentTemplate();
        template.name = name;
        template.description = description || '';
        const savedTemplate = await templateRepository.save(template);
        // フィールド定義の保存（存在する場合）
        if (fields && Array.isArray(fields) && fields.length > 0) {
            const fieldEntities = fields.map(field => {
                const fieldDefinition = new FieldDefinition_1.FieldDefinition();
                fieldDefinition.name = field.name;
                fieldDefinition.description = field.description || '';
                fieldDefinition.fieldType = field.fieldType || 'text';
                fieldDefinition.validationRegex = field.validationRegex || null;
                fieldDefinition.coordinates = field.coordinates || null;
                fieldDefinition.template = savedTemplate;
                return fieldDefinition;
            });
            await fieldDefinitionRepository.save(fieldEntities);
            savedTemplate.fields = fieldEntities;
        }
        res.status(201).json(savedTemplate);
    }
    catch (error) {
        console.error('テンプレート作成エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.createTemplate = createTemplate;
// テンプレートを更新
const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, fields } = req.body;
        const template = await templateRepository.findOne({
            where: { id },
            relations: ['fields']
        });
        if (!template) {
            return res.status(404).json({ message: 'テンプレートが見つかりません' });
        }
        if (name)
            template.name = name;
        if (description !== undefined)
            template.description = description;
        await templateRepository.save(template);
        // フィールド定義の更新（存在する場合）
        if (fields && Array.isArray(fields)) {
            // 既存のフィールドを削除
            if (template.fields && template.fields.length > 0) {
                await fieldDefinitionRepository.remove(template.fields);
            }
            // 新しいフィールドを追加
            const fieldEntities = fields.map(field => {
                const fieldDefinition = new FieldDefinition_1.FieldDefinition();
                fieldDefinition.name = field.name;
                fieldDefinition.description = field.description || '';
                fieldDefinition.fieldType = field.fieldType || 'text';
                fieldDefinition.validationRegex = field.validationRegex || null;
                fieldDefinition.coordinates = field.coordinates || null;
                fieldDefinition.template = template;
                return fieldDefinition;
            });
            await fieldDefinitionRepository.save(fieldEntities);
            template.fields = fieldEntities;
        }
        res.status(200).json(template);
    }
    catch (error) {
        console.error('テンプレート更新エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.updateTemplate = updateTemplate;
// テンプレートを削除
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await templateRepository.findOne({
            where: { id },
            relations: ['fields']
        });
        if (!template) {
            return res.status(404).json({ message: 'テンプレートが見つかりません' });
        }
        await templateRepository.remove(template);
        res.status(200).json({ message: 'テンプレートが削除されました' });
    }
    catch (error) {
        console.error('テンプレート削除エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};
exports.deleteTemplate = deleteTemplate;
//# sourceMappingURL=template.controller.js.map