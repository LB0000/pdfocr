"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// ドキュメントコンテキストの型定義
interface DocumentContextType {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  fetchDocumentById: (id: string) => Promise<void>;
  uploadDocument: (data: DocumentUploadData) => Promise<void>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

// ドキュメント型定義
interface Document {
  id: string;
  name: string;
  description: string;
  filePath: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  fields?: DocumentField[];
}

// ドキュメントフィールド型定義
interface DocumentField {
  id: string;
  name: string;
  value: string;
  confidence: number;
  fieldDefinitionId: string;
}

// ドキュメントアップロードデータ型定義
interface DocumentUploadData {
  file: File;
  name?: string;
  description?: string;
  templateId?: string;
}

// デフォルト値の作成
const defaultDocumentContext: DocumentContextType = {
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  fetchDocuments: async () => {},
  fetchDocumentById: async () => {},
  uploadDocument: async () => {},
  updateDocument: async () => {},
  deleteDocument: async () => {}
};

// コンテキストの作成
const DocumentContext = createContext<DocumentContextType>(defaultDocumentContext);

// コンテキストプロバイダーコンポーネント
export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // トークンの取得
  const getToken = () => {
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
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'ドキュメントの取得に失敗しました');
      }
      
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメント詳細の取得
  const fetchDocumentById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'ドキュメントの取得に失敗しました');
      }
      
      setCurrentDocument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメントのアップロード
  const uploadDocument = async (data: DocumentUploadData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.name) {
        formData.append('name', data.name);
      }
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.templateId) {
        formData.append('templateId', data.templateId);
      }
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const dataResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(dataResponse.message || 'ドキュメントのアップロードに失敗しました');
      }
      
      // 成功したら一覧を更新
      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメントの更新
  const updateDocument = async (id: string, data: Partial<Document>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'ドキュメントの更新に失敗しました');
      }
      
      // 現在表示中のドキュメントを更新
      if (currentDocument && currentDocument.id === id) {
        setCurrentDocument({ ...currentDocument, ...data });
      }
      
      // 一覧も更新
      setDocuments(documents.map(doc => 
        doc.id === id ? { ...doc, ...data } : doc
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドキュメントの削除
  const deleteDocument = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'ドキュメントの削除に失敗しました');
      }
      
      // 一覧から削除
      setDocuments(documents.filter(doc => doc.id !== id));
      
      // 現在表示中のドキュメントをクリア
      if (currentDocument && currentDocument.id === id) {
        setCurrentDocument(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
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
        fetchDocumentById,
        uploadDocument,
        updateDocument,
        deleteDocument
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

// カスタムフック
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
