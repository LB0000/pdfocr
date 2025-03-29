import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ドキュメントコンテキストの型定義
interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<Document>;
  uploadDocument: (file: File, description?: string, templateId?: string) => Promise<void>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

// ドキュメント型定義
export interface Document {
  id: string;
  fileName: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  originalFilePath?: string;
  processedFilePath?: string;
  ocrResult?: any;
  layoutAnalysisResult?: any;
  confidenceScore: number;
  templateId?: string;
  template?: any;
  createdAt: string;
  updatedAt: string;
}

// デフォルト値
const defaultDocumentContext: DocumentContextType = {
  documents: [],
  loading: false,
  error: null,
  fetchDocuments: async () => {},
  getDocument: async () => ({} as Document),
  uploadDocument: async () => {},
  updateDocument: async () => {},
  deleteDocument: async () => {},
};

// コンテキスト作成
const DocumentContext = createContext<DocumentContextType>(defaultDocumentContext);

// コンテキストプロバイダー
export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ドキュメント一覧取得
  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'ドキュメントの取得に失敗しました');
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message);
      console.error('ドキュメント取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  // ドキュメント詳細取得
  const getDocument = async (id: string): Promise<Document> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'ドキュメントの取得に失敗しました');
      }
      
      const document = await response.json();
      return document;
    } catch (err: any) {
      setError(err.message);
      console.error('ドキュメント詳細取得エラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメントアップロード
  const uploadDocument = async (file: File, description?: string, templateId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      if (description) {
        formData.append('description', description);
      }
      
      if (templateId) {
        formData.append('templateId', templateId);
      }
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'ドキュメントのアップロードに失敗しました');
      }
      
      // ドキュメント一覧を更新
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message);
      console.error('ドキュメントアップロードエラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメント更新
  const updateDocument = async (id: string, data: Partial<Document>) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'ドキュメントの更新に失敗しました');
      }
      
      // ドキュメント一覧を更新
      await fetchDocuments();
    } catch (err: any) {
      setError(err.message);
      console.error('ドキュメント更新エラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ドキュメント削除
  const deleteDocument = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'ドキュメントの削除に失敗しました');
      }
      
      // ドキュメント一覧から削除したドキュメントを除外
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('ドキュメント削除エラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    documents,
    loading,
    error,
    fetchDocuments,
    getDocument,
    uploadDocument,
    updateDocument,
    deleteDocument
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

// カスタムフック
export const useDocuments = () => useContext(DocumentContext);
