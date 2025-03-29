import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { DocumentTemplate } from '../entities/DocumentTemplate';
import { User } from '../entities/User';

const templateRepository = AppDataSource.getRepository(DocumentTemplate);
const userRepository = AppDataSource.getRepository(User);

// すべてのテンプレートを取得
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await templateRepository.find({
      relations: ['creator'],
      order: {
        isDefault: 'DESC',
        name: 'ASC'
      }
    });
    
    res.status(200).json({ templates });
  } catch (error) {
    console.error('テンプレート一覧取得エラー:', error);
    res.status(500).json({ error: { message: 'テンプレート一覧の取得中にエラーが発生しました', code: 'TEMPLATES_FETCH_ERROR' } });
  }
};

// 特定のテンプレートを取得
export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const template = await templateRepository.findOne({
      where: { id },
      relations: ['creator']
    });
    
    if (!template) {
      return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
    }
    
    res.status(200).json({ template });
  } catch (error) {
    console.error('テンプレート取得エラー:', error);
    res.status(500).json({ error: { message: 'テンプレートの取得中にエラーが発生しました', code: 'TEMPLATE_FETCH_ERROR' } });
  }
};

// 新しいテンプレートを作成
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, isDefault } = req.body;
    
    // 入力検証
    if (!name) {
      return res.status(400).json({ error: { message: 'テンプレート名は必須です', code: 'MISSING_REQUIRED_FIELDS' } });
    }
    
    // ユーザーの取得
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    if (!user) {
      return res.status(404).json({ error: { message: 'ユーザーが見つかりません', code: 'USER_NOT_FOUND' } });
    }
    
    // テンプレートの作成
    const template = new DocumentTemplate();
    template.name = name;
    template.description = description;
    template.isDefault = isDefault || false;
    template.creator = user;
    template.createdBy = user.id;
    
    // デフォルトテンプレートの設定
    if (template.isDefault) {
      // 既存のデフォルトテンプレートをリセット
      await templateRepository.update(
        { isDefault: true },
        { isDefault: false }
      );
    }
    
    await templateRepository.save(template);
    
    res.status(201).json({
      message: 'テンプレートが正常に作成されました',
      template
    });
  } catch (error) {
    console.error('テンプレート作成エラー:', error);
    res.status(500).json({ error: { message: 'テンプレートの作成中にエラーが発生しました', code: 'TEMPLATE_CREATE_ERROR' } });
  }
};

// テンプレートを更新
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    
    const template = await templateRepository.findOne({ where: { id } });
    
    if (!template) {
      return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
    }
    
    // 更新するフィールドの設定
    if (name) template.name = name;
    if (description !== undefined) template.description = description;
    if (isActive !== undefined) template.isActive = isActive;
    
    await templateRepository.save(template);
    
    res.status(200).json({
      message: 'テンプレートが正常に更新されました',
      template
    });
  } catch (error) {
    console.error('テンプレート更新エラー:', error);
    res.status(500).json({ error: { message: 'テンプレートの更新中にエラーが発生しました', code: 'TEMPLATE_UPDATE_ERROR' } });
  }
};

// テンプレートを削除
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const template = await templateRepository.findOne({ where: { id } });
    
    if (!template) {
      return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
    }
    
    // デフォルトテンプレートは削除できない
    if (template.isDefault) {
      return res.status(400).json({ error: { message: 'デフォルトテンプレートは削除できません', code: 'CANNOT_DELETE_DEFAULT_TEMPLATE' } });
    }
    
    await templateRepository.remove(template);
    
    res.status(200).json({ message: 'テンプレートが正常に削除されました' });
  } catch (error) {
    console.error('テンプレート削除エラー:', error);
    res.status(500).json({ error: { message: 'テンプレートの削除中にエラーが発生しました', code: 'TEMPLATE_DELETE_ERROR' } });
  }
};

// デフォルトテンプレートを設定
export const setDefaultTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const template = await templateRepository.findOne({ where: { id } });
    
    if (!template) {
      return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
    }
    
    // 既存のデフォルトテンプレートをリセット
    await templateRepository.update(
      { isDefault: true },
      { isDefault: false }
    );
    
    // 新しいデフォルトテンプレートを設定
    template.isDefault = true;
    await templateRepository.save(template);
    
    res.status(200).json({
      message: 'デフォルトテンプレートが正常に設定されました',
      template
    });
  } catch (error) {
    console.error('デフォルトテンプレート設定エラー:', error);
    res.status(500).json({ error: { message: 'デフォルトテンプレートの設定中にエラーが発生しました', code: 'DEFAULT_TEMPLATE_ERROR' } });
  }
};
