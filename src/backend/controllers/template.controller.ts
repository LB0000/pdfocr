import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { DocumentTemplate } from '../entities/DocumentTemplate';
import { FieldDefinition } from '../entities/FieldDefinition';
import { User } from '../entities/User';
import { TemplateField } from '../entities/TemplateField';

const templateRepository = AppDataSource.getRepository(DocumentTemplate);
const fieldDefinitionRepository = AppDataSource.getRepository(FieldDefinition);
const userRepository = AppDataSource.getRepository(User);
const templateFieldRepository = AppDataSource.getRepository(TemplateField);

// すべてのテンプレートを取得
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const templates = await templateRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
    
    res.status(200).json({
      message: 'テンプレート一覧の取得に成功しました',
      templates
    });
  } catch (error) {
    console.error('テンプレート取得エラー:', error);
    res.status(500).json({ 
      message: 'テンプレート一覧の取得中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 特定のテンプレートを取得
export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const template = await templateRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['fields']
    });
    
    if (!template) {
      return res.status(404).json({ 
        message: 'テンプレートが見つかりません',
        details: { id }
      });
    }
    
    res.status(200).json({
      message: 'テンプレートの取得に成功しました',
      template
    });
  } catch (error) {
    console.error('テンプレート取得エラー:', error);
    res.status(500).json({ 
      message: 'テンプレートの取得中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// テンプレートを作成
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, fields } = req.body;
    const userId = (req as any).user.id;
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'ユーザーが見つかりません',
        details: { userId }
      });
    }
    
    if (!name) {
      return res.status(400).json({ 
        message: 'テンプレート名は必須です',
        details: { required: 'name' }
      });
    }
    
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ 
        message: 'テンプレートには少なくとも1つのフィールドが必要です',
        details: { required: 'fields' }
      });
    }
    
    const template = new DocumentTemplate();
    template.name = name;
    template.description = description || '';
    template.user = user;
    
    await templateRepository.save(template);
    
    // フィールドの作成
    for (const field of fields) {
      const fieldDefinition = new FieldDefinition();
      fieldDefinition.name = field.name;
      fieldDefinition.description = field.description || '';
      fieldDefinition.fieldType = field.fieldType || 'text';
      fieldDefinition.validationRegex = field.validationRegex || null;
      fieldDefinition.coordinates = field.coordinates || null;
      fieldDefinition.template = template;
      await fieldDefinitionRepository.save(fieldDefinition);
    }
    
    res.status(201).json({
      message: 'テンプレートの作成に成功しました',
      template
    });
  } catch (error) {
    console.error('テンプレート作成エラー:', error);
    res.status(500).json({ 
      message: 'テンプレートの作成中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// テンプレートを更新
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, fields } = req.body;
    const userId = (req as any).user.id;
    
    const template = await templateRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['fields']
    });
    
    if (!template) {
      return res.status(404).json({ 
        message: 'テンプレートが見つかりません',
        details: { id }
      });
    }
    
    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    
    await templateRepository.save(template);
    
    // フィールドの更新
    if (Array.isArray(fields)) {
      // 既存のフィールドを削除
      await fieldDefinitionRepository.delete(template.fields);
      
      // 新しいフィールドを作成
      for (const field of fields) {
        const fieldDefinition = new FieldDefinition();
        fieldDefinition.name = field.name;
        fieldDefinition.description = field.description || '';
        fieldDefinition.fieldType = field.fieldType || 'text';
        fieldDefinition.validationRegex = field.validationRegex || null;
        fieldDefinition.coordinates = field.coordinates || null;
        fieldDefinition.template = template;
        await fieldDefinitionRepository.save(fieldDefinition);
      }
    }
    
    res.status(200).json({
      message: 'テンプレートの更新に成功しました',
      template
    });
  } catch (error) {
    console.error('テンプレート更新エラー:', error);
    res.status(500).json({ 
      message: 'テンプレートの更新中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// テンプレートを削除
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const template = await templateRepository.findOne({
      where: { id, user: { id: userId } }
    });
    
    if (!template) {
      return res.status(404).json({ 
        message: 'テンプレートが見つかりません',
        details: { id }
      });
    }
    
    await templateRepository.remove(template);
    
    res.status(200).json({
      message: 'テンプレートの削除に成功しました',
      details: { id }
    });
  } catch (error) {
    console.error('テンプレート削除エラー:', error);
    res.status(500).json({ 
      message: 'テンプレートの削除中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
