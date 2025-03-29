"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiResponse, DocumentResponse, SingleDocumentResponse } from '@/types/api';

// ドキュメントコンテキストの型定義
interface DocumentContextType {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (id: string) => Promise<Document>;
  uploadDocument: (data: DocumentUploadData) => Promise<Document>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
}

// ドキュメント型定義
export interface Document {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  fields?: Record<string, any>;
}

// ドキュメントフィールド型定義
export interface DocumentField {
  name: string;
  value: string;
  confidence: number;
}

// ドキュメントアップロードデータ型定義
export interface DocumentUploadData {
  name: string;
  description?: string;
  templateId?: string;
  file: File;
}

// デフォルト値の作成
const defaultDocumentContext: DocumentContextType = {
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  fetchDocuments: async () => {},
  fetchDocument: async () => ({ id: '', name: '', description: '', filePath: '', status: '', createdAt: '', updatedAt: '' }),
  uploadDocument: async () => ({ id: '', name: '', description: '', filePath: '', status: '', createdAt: '', updatedAt: '' }),
  updateDocument: async () => ({ id: '', name: '', description: '', filePath: '', status: '', createdAt: '', updatedAt: '' }),
  deleteDocument: async () => {}
};

// コンテキストの作成
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// コンテキストプロバイダーコンポーネント
export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // トークンの取得
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // ドキュメント一覧の取得
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('認証トークンが見つかりません');
      }
      
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json() as ApiResponse<DocumentResponse>;
      
      if (!response.ok) {
        throw new Error(data.message || 'ドキュメントの取得に失敗しました');
      }
      
      setDocuments(data.data.documents);
    } catch (error) {
      console.error('Fetch documents error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメント詳細の取得
  const fetchDocument = async (id: string): Promise<Document> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('認証トークンが見つかりません');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json() as ApiResponse<SingleDocumentResponse>;
      
      if (!response.ok) {
        throw new Error(data.message || 'ドキュメントの取得に失敗しました');
      }
      
      setCurrentDocument(data.data.document);
      return data.data.document;
    } catch (error) {
      console.error('Fetch document error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメントのアップロード
  const uploadDocument = async (data: DocumentUploadData): Promise<Document> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('認証トークンが見つかりません');
      }
      
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.templateId) {
        formData.append('templateId', data.templateId);
      }
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const dataResponse = await response.json() as ApiResponse<SingleDocumentResponse>;
      
      if (!response.ok) {
        throw new Error(dataResponse.message || 'ドキュメントのアップロードに失敗しました');
      }
      
      setDocuments(prev => [...prev, dataResponse.data.document]);
      return dataResponse.data.document;
    } catch (error) {
      console.error('Upload document error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメントの更新
  const updateDocument = async (id: string, data: Partial<Document>): Promise<Document> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('認証トークンが見つかりません');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json() as ApiResponse<SingleDocumentResponse>;
      
      if (!response.ok) {
        throw new Error(responseData.message || 'ドキュメントの更新に失敗しました');
      }
      
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? responseData.data.document : doc
      ));
      setCurrentDocument(responseData.data.document);
      return responseData.data.document;
    } catch (error) {
      console.error('Update document error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメントの削除
  const deleteDocument = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('認証トークンが見つかりません');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json() as ApiResponse<void>;
      
      if (!response.ok) {
        throw new Error(data.message || 'ドキュメントの削除に失敗しました');
      }
      
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (currentDocument?.id === id) {
        setCurrentDocument(null);
      }
    } catch (error) {
      console.error('Delete document error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        currentDocument,
        isLoading,
        error,
        fetchDocuments,
        fetchDocument,
        uploadDocument,
        updateDocument,
        deleteDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

// カスタムフック
export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
