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
    
    res.status(200).json(documents);
  } catch (error) {
    console.error('ドキュメント取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
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
      return res.status(404).json({ message: 'ドキュメントが見つかりません' });
    }
    
    res.status(200).json(document);
  } catch (error) {
    console.error('ドキュメント取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// ドキュメントをアップロード
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'ファイルが提供されていません' });
    }
    
    const { name, description } = req.body;
    const userId = (req as any).user.id;
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    
    const document = new Document();
    document.name = name || req.file.originalname;
    document.description = description || '';
    document.filePath = req.file.path;
    document.status = 'pending';
    document.user = user;
    
    await documentRepository.save(document);
    
    res.status(201).json(document);
  } catch (error) {
    console.error('ドキュメントアップロードエラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
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
      return res.status(404).json({ message: 'ドキュメントが見つかりません' });
    }
    
    if (name) document.name = name;
    if (description !== undefined) document.description = description;
    if (status) document.status = status;
    
    await documentRepository.save(document);
    
    res.status(200).json(document);
  } catch (error) {
    console.error('ドキュメント更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
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
