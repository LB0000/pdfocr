import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Document } from '../entities/Document';
import { User } from '../entities/User';
import * as fs from 'fs';
import * as path from 'path';

const documentRepository = AppDataSource.getRepository(Document);
const userRepository = AppDataSource.getRepository(User);

// すべてのドキュメントを取得
export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const documents = await documentRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
    
    res.status(200).json({
      message: 'ドキュメント一覧の取得に成功しました',
      documents
    });
  } catch (error) {
    console.error('ドキュメント取得エラー:', error);
    res.status(500).json({ 
      message: 'ドキュメント一覧の取得中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 特定のドキュメントを取得
export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const document = await documentRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['fields']
    });
    
    if (!document) {
      return res.status(404).json({ 
        message: 'ドキュメントが見つかりません',
        details: { id }
      });
    }
    
    res.status(200).json({
      message: 'ドキュメントの取得に成功しました',
      document
    });
  } catch (error) {
    console.error('ドキュメント取得エラー:', error);
    res.status(500).json({ 
      message: 'ドキュメントの取得中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ドキュメントをアップロード
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'ファイルが提供されていません',
        details: { required: 'PDFファイル' }
      });
    }

    // ファイルタイプの検証
    if (!req.file.mimetype.includes('pdf')) {
      return res.status(400).json({ 
        message: 'PDFファイルのみアップロード可能です',
        details: { 
          provided: req.file.mimetype,
          required: 'application/pdf'
        }
      });
    }

    // ファイルサイズの検証（例：10MB以下）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        message: 'ファイルサイズが大きすぎます',
        details: { 
          provided: `${Math.round(req.file.size / 1024 / 1024)}MB`,
          maxSize: '10MB'
        }
      });
    }
    
    const { name, description } = req.body;
    const userId = (req as any).user.id;
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'ユーザーが見つかりません',
        details: { userId }
      });
    }
    
    const document = new Document();
    document.name = name || req.file.originalname;
    document.description = description || '';
    document.filePath = req.file.path;
    document.status = 'pending';
    document.user = user;
    
    await documentRepository.save(document);
    
    res.status(201).json({
      message: 'ドキュメントのアップロードに成功しました',
      document
    });
  } catch (error) {
    console.error('ドキュメントアップロードエラー:', error);
    res.status(500).json({ 
      message: 'ドキュメントのアップロード中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ドキュメントを更新
export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const userId = (req as any).user.id;
    
    const document = await documentRepository.findOne({
      where: { id, user: { id: userId } }
    });
    
    if (!document) {
      return res.status(404).json({ 
        message: 'ドキュメントが見つかりません',
        details: { id }
      });
    }
    
    if (name) document.name = name;
    if (description !== undefined) document.description = description;
    if (status) document.status = status;
    
    await documentRepository.save(document);
    
    res.status(200).json({
      message: 'ドキュメントの更新に成功しました',
      document
    });
  } catch (error) {
    console.error('ドキュメント更新エラー:', error);
    res.status(500).json({ 
      message: 'ドキュメントの更新中にエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ドキュメントを削除
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const document = await documentRepository.findOne({
      where: { id, user: { id: userId } }
    });
    
    if (!document) {
      return res.status(404).json({ message: 'ドキュメントが見つかりません' });
    }
    
    // ファイルの削除
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    await documentRepository.remove(document);
    
    res.status(200).json({ message: 'ドキュメントが削除されました' });
  } catch (error) {
    console.error('ドキュメント削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};
