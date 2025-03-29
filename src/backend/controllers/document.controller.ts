import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Document } from '../entities/Document';
import { DocumentField } from '../entities/DocumentField';
import { DocumentTemplate } from '../entities/DocumentTemplate';
import { User } from '../entities/User';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const documentRepository = AppDataSource.getRepository(Document);
const documentFieldRepository = AppDataSource.getRepository(DocumentField);
const templateRepository = AppDataSource.getRepository(DocumentTemplate);
const userRepository = AppDataSource.getRepository(User);

// すべてのドキュメントを取得
export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const { status, templateId } = req.query;
    
    // クエリ条件の構築
    const whereConditions: any = {};
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (templateId) {
      whereConditions.templateId = templateId;
    }
    
    // 一般ユーザーは自分のドキュメントのみ閲覧可能
    if (req.user?.role === 'user') {
      whereConditions.uploadedBy = req.user.id;
    }
    
    const documents = await documentRepository.find({
      where: whereConditions,
      relations: ['template', 'uploader'],
      order: { createdAt: 'DESC' }
    });
    
    res.status(200).json({ documents });
  } catch (error) {
    console.error('ドキュメント一覧取得エラー:', error);
    res.status(500).json({ error: { message: 'ドキュメント一覧の取得中にエラーが発生しました', code: 'DOCUMENTS_FETCH_ERROR' } });
  }
};

// 特定のドキュメントを取得
export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const document = await documentRepository.findOne({
      where: { id },
      relations: ['template', 'uploader']
    });
    
    if (!document) {
      return res.status(404).json({ error: { message: 'ドキュメントが見つかりません', code: 'DOCUMENT_NOT_FOUND' } });
    }
    
    // 一般ユーザーは自分のドキュメントのみ閲覧可能
    if (req.user?.role === 'user' && document.uploadedBy !== req.user.id) {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }
    
    res.status(200).json({ document });
  } catch (error) {
    console.error('ドキュメント取得エラー:', error);
    res.status(500).json({ error: { message: 'ドキュメントの取得中にエラーが発生しました', code: 'DOCUMENT_FETCH_ERROR' } });
  }
};

// ドキュメントのフィールド一覧を取得
export const getDocumentFields = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const document = await documentRepository.findOne({ where: { id } });
    
    if (!document) {
      return res.status(404).json({ error: { message: 'ドキュメントが見つかりません', code: 'DOCUMENT_NOT_FOUND' } });
    }
    
    // 一般ユーザーは自分のドキュメントのみ閲覧可能
    if (req.user?.role === 'user' && document.uploadedBy !== req.user.id) {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }
    
    const fields = await documentFieldRepository.find({
      where: { documentId: id },
      relations: ['fieldDefinition', 'editor'],
      order: { 
        fieldDefinition: { displayOrder: 'ASC' } 
      }
    });
    
    res.status(200).json({ fields });
  } catch (error) {
    console.error('ドキュメントフィールド取得エラー:', error);
    res.status(500).json({ error: { message: 'ドキュメントフィールドの取得中にエラーが発生しました', code: 'DOCUMENT_FIELDS_FETCH_ERROR' } });
  }
};

// ドキュメントのアップロード
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    // 実際の実装ではmulterなどを使用してファイルアップロードを処理
    // ここではモックとして実装
    const { fileName, description, templateId } = req.body;
    
    if (!fileName) {
      return res.status(400).json({ error: { message: 'ファイル名は必須です', code: 'MISSING_REQUIRED_FIELDS' } });
    }
    
    // ユーザーの取得
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    if (!user) {
      return res.status(404).json({ error: { message: 'ユーザーが見つかりません', code: 'USER_NOT_FOUND' } });
    }
    
    // テンプレートの取得（指定がある場合）
    let template = null;
    if (templateId) {
      template = await templateRepository.findOne({ where: { id: templateId } });
      if (!template) {
        return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
      }
    } else {
      // デフォルトテンプレートを取得
      template = await templateRepository.findOne({ where: { isDefault: true } });
    }
    
    // ドキュメントの作成
    const document = new Document();
    document.fileName = fileName;
    document.description = description;
    document.originalFilePath = `/uploads/${uuidv4()}_${fileName}`; // 実際のパスはファイルアップロード処理で設定
    document.status = 'pending';
    document.uploader = user;
    document.uploadedBy = user.id;
    
    if (template) {
      document.template = template;
      document.templateId = template.id;
    }
    
    await documentRepository.save(document);
    
    res.status(201).json({
      message: 'ドキュメントが正常にアップロードされました',
      document
    });
  } catch (error) {
    console.error('ドキュメントアップロードエラー:', error);
    res.status(500).json({ error: { message: 'ドキュメントのアップロード中にエラーが発生しました', code: 'DOCUMENT_UPLOAD_ERROR' } });
  }
};

// ドキュメントの処理（OCR実行）
export const processDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const document = await documentRepository.findOne({ where: { id } });
    
    if (!document) {
      return res.status(404).json({ error: { message: 'ドキュメントが見つかりません', code: 'DOCUMENT_NOT_FOUND' } });
    }
    
    // 一般ユーザーは自分のドキュメントのみ処理可能
    if (req.user?.role === 'user' && document.uploadedBy !== req.user.id) {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }
    
    // 処理中に設定
    document.status = 'processing';
    await documentRepository.save(document);
    
    // 実際の実装ではOCR処理をキューに入れるなどの非同期処理
    // ここではモックとして実装
    
    // 処理完了に設定（実際には非同期で更新）
    document.status = 'completed';
    document.ocrResult = { text: 'OCR処理結果のサンプルテキスト' };
    document.confidenceScore = 0.95;
    
    await documentRepository.save(document);
    
    res.status(200).json({
      message: 'ドキュメント処理が開始されました',
      document
    });
  } catch (error) {
    console.error('ドキュメント処理エラー:', error);
    res.status(500).json({ error: { message: 'ドキュメントの処理中にエラーが発生しました', code: 'DOCUMENT_PROCESS_ERROR' } });
  }
};

// ドキュメント情報の更新
export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, templateId } = req.body;
    
    const document = await documentRepository.findOne({ where: { id } });
    
    if (!document) {
      return res.status(404).json({ error: { message: 'ドキュメントが見つかりません', code: 'DOCUMENT_NOT_FOUND' } });
    }
    
    // 一般ユーザーは自分のドキュメントのみ更新可能
    if (req.user?.role === 'user' && document.uploadedBy !== req.user.id) {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }
    
    // 更新するフィールドの設定
    if (description !== undefined) document.description = description;
    
    // テンプレートの更新
    if (templateId && templateId !== document.templateId) {
      const template = await templateRepository.findOne({ where: { id: templateId } });
      if (!template) {
        return res.status(404).json({ error: { message: 'テンプレートが見つかりません', code: 'TEMPLATE_NOT_FOUND' } });
      }
      
      document.template = template;
      document.templateId = template.id;
    }
    
    await documentRepository.save(document);
    
    res.status(200).json({
      message: 'ドキュメント情報が正常に更新されました',
      document
    });
  } catch (error) {
    console.error('ドキュメント更新エラー:', error);
    res.status(500).json({ error: { message: 'ドキュメントの更新中にエラーが発生しました', code: 'DOCUMENT_UPDATE_ERROR' } });
  }
};

// ドキュメントの削除
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const document = await documentRepository.findOne({ where: { id } });
    
    if (!document) {
      return res.status(404).json({ error: { message: 'ドキュメントが見つかりません', code: 'DOCUMENT_NOT_FOUND' } });
    }
    
    // 一般ユーザーは自分のドキュメントのみ削除可能
    if (req.user?.role === 'user' && document.uploadedBy !== req.user.id) {
      return res.status(403).json({ error: { message: 'このリソースへのアクセス権限がありません', code: 'ACCESS_DENIED' } });
    }
    
    // ファイルの削除（実際の実装ではファイルストレージからの削除処理）
    if (document.originalFilePath && fs.existsSync(document.originalFilePath)) {
      fs.unlinkSync(document.originalFilePath);
    }
    
    if (document.processedFilePath && fs.existsSync(document.processedFilePath)) {
      fs.unlinkSync(document.processedFilePath);
    }
    
    await documentRepository.remove(document);
    
    res.status(200).json({ message: 'ドキュメントが正常に削除されました' });
  } catch (error) {
    console.error('ドキュメント削除エラー:', error);
    res.status(500).json({ error: { message: 'ドキュメントの削除中にエラーが発生しました', code: 'DOCUMENT_DELETE_ERROR' } });
  }
};
