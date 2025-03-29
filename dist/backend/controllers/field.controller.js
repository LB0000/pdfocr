"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteField = exports.updateField = exports.createField = exports.getFieldById = exports.getFieldsByTemplateId = void 0;
const data_source_1 = require("../config/data-source");
const FieldDefinition_1 = require("../entities/FieldDefinition");
const DocumentTemplate_1 = require("../entities/DocumentTemplate");
const fieldRepository = data_source_1.AppDataSource.getRepository(FieldDefinition_1.FieldDefinition);
const templateRepository = data_source_1.AppDataSource.getRepository(DocumentTemplate_1.DocumentTemplate);
// テンプレートに属するフィールド一覧を取得
const getFieldsByTemplateId = async (req, res) => {
    try {
        const { templateId } = req.params;
        // テンプレートの存在確認
        const template = await templateRepository.findOne({ where: { id: templateId } });
        if (!template) {
            return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
        }
        const fields = await fieldRepository.find({
            where: { templateId },
            order: { displayOrder: 'ASC' }
        });
        res.status(200).json({ fields });
    }
    catch (error) {
        console.error('フィールド一覧取得エラー:', error);
        res.status(500).json({ error: { message: 'フィールド一覧の取得中にエラーが発生しました', code: 'FIELDS_FETCH_ERROR' } });
    }
};
exports.getFieldsByTemplateId = getFieldsByTemplateId;
// 特定のフィールドを取得
const getFieldById = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await fieldRepository.findOne({
            where: { id },
            relations: ['template']
        });
        if (!field) {
            return res.status(404).json({ error: { message: 'フィールドが見つかりません', code: 'FIELD_NOT_FOUND' } });
        }
        res.status(200).json({ field });
    }
    catch (error) {
        console.error('フィールド取得エラー:', error);
        res.status(500).json({ error: { message: 'フィールドの取得中にエラーが発生しました', code: 'FIELD_FETCH_ERROR' } });
    }
};
exports.getFieldById = getFieldById;
// 新しいフィールドを作成
const createField = async (req, res) => {
    try {
        const { name, description, templateId, position, fieldType, validationRules, displayOrder } = req.body;
        // 入力検証
        if (!name || !templateId) {
            return res.status(400).json({ error: { message: 'フィールド名とテンプレートIDは必須です', code: 'MISSING_REQUIRED_FIELDS' } });
        }
        // テンプレートの存在確認
        const template = await templateRepository.findOne({ where: { id: templateId } });
        if (!template) {
            return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
        }
        // フィールドの作成
        const field = new FieldDefinition_1.FieldDefinition();
        field.name = name;
        field.description = description;
        field.template = template;
        field.templateId = templateId;
        field.position = position;
        field.fieldType = fieldType || 'text';
        field.validationRules = validationRules;
        // 表示順序の設定
        if (displayOrder !== undefined) {
            field.displayOrder = displayOrder;
        }
        else {
            // 最大の表示順序を取得して+1
            const maxOrderField = await fieldRepository.findOne({
                where: { templateId },
                order: { displayOrder: 'DESC' }
            });
            field.displayOrder = maxOrderField ? (maxOrderField.displayOrder || 0) + 1 : 0;
        }
        await fieldRepository.save(field);
        res.status(201).json({
            message: 'フィールドが正常に作成されました',
            field
        });
    }
    catch (error) {
        console.error('フィールド作成エラー:', error);
        res.status(500).json({ error: { message: 'フィールドの作成中にエラーが発生しました', code: 'FIELD_CREATE_ERROR' } });
    }
};
exports.createField = createField;
// フィールドを更新
const updateField = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, position, fieldType, validationRules, displayOrder } = req.body;
        const field = await fieldRepository.findOne({ where: { id } });
        if (!field) {
            return res.status(404).json({ error: { message: 'フィールドが見つかりません', code: 'FIELD_NOT_FOUND' } });
        }
        // 更新するフィールドの設定
        if (name)
            field.name = name;
        if (description !== undefined)
            field.description = description;
        if (position)
            field.position = position;
        if (fieldType)
            field.fieldType = fieldType;
        if (validationRules)
            field.validationRules = validationRules;
        if (displayOrder !== undefined)
            field.displayOrder = displayOrder;
        await fieldRepository.save(field);
        res.status(200).json({
            message: 'フィールドが正常に更新されました',
            field
        });
    }
    catch (error) {
        console.error('フィールド更新エラー:', error);
        res.status(500).json({ error: { message: 'フィールドの更新中にエラーが発生しました', code: 'FIELD_UPDATE_ERROR' } });
    }
};
exports.updateField = updateField;
// フィールドを削除
const deleteField = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await fieldRepository.findOne({ where: { id } });
        if (!field) {
            return res.status(404).json({ error: { message: 'フィールドが見つかりません', code: 'FIELD_NOT_FOUND' } });
        }
        await fieldRepository.remove(field);
        res.status(200).json({ message: 'フィールドが正常に削除されました' });
    }
    catch (error) {
        console.error('フィールド削除エラー:', error);
        res.status(500).json({ error: { message: 'フィールドの削除中にエラーが発生しました', code: 'FIELD_DELETE_ERROR' } });
    }
};
exports.deleteField = deleteField;
//# sourceMappingURL=field.controller.js.map