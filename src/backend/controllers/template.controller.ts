import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { DocumentTemplate } from '../entities/DocumentTemplate';
import { FieldDefinition } from '../entities/FieldDefinition';

const templateRepository = AppDataSource.getRepository(DocumentTemplate);
const fieldDefinitionRepository = AppDataSource.getRepository(FieldDefinition);

// すべてのテンプレートを取得
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await templateRepository.find({
      order: { createdAt: 'DESC' }
    });
    
    res.status(200).json(templates);
  } catch (error) {
    console.error('テンプレート取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 特定のテンプレートを取得
export const getTemplateById = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('テンプレート取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// テンプレートを作成
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, fields } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'テンプレート名は必須です' });
    }
    
    const template = new DocumentTemplate();
    template.name = name;
    template.description = description || '';
    
    const savedTemplate = await templateRepository.save(template);
    
    // フィールド定義の保存（存在する場合）
    if (fields && Array.isArray(fields) && fields.length > 0) {
      const fieldEntities = fields.map(field => {
        const fieldDefinition = new FieldDefinition();
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
  } catch (error) {
    console.error('テンプレート作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// テンプレートを更新
export const updateTemplate = async (req: Request, res: Response) => {
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
    
    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    
    await templateRepository.save(template);
    
    // フィールド定義の更新（存在する場合）
    if (fields && Array.isArray(fields)) {
      // 既存のフィールドを削除
      if (template.fields && template.fields.length > 0) {
        await fieldDefinitionRepository.remove(template.fields);
      }
      
      // 新しいフィールドを追加
      const fieldEntities = fields.map(field => {
        const fieldDefinition = new FieldDefinition();
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
  } catch (error) {
    console.error('テンプレート更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// テンプレートを削除
export const deleteTemplate = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('テンプレート削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};
