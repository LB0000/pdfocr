import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// テンプレートコンテキストの型定義
interface TemplateContextType {
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: (activeOnly?: boolean) => Promise<void>;
  getTemplate: (id: string) => Promise<TemplateWithFields>;
  createTemplate: (data: TemplateCreateData) => Promise<void>;
  updateTemplate: (id: string, data: TemplateUpdateData) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

// テンプレート型定義
export interface Template {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  userId?: string;
  user?: any;
  createdAt: string;
  updatedAt: string;
}

// フィールド型定義
export interface FieldDefinition {
  id?: string;
  name: string;
  description?: string;
  position?: any;
  fieldType: string;
  validationRules?: any;
  displayOrder?: number;
  templateId?: string;
}

// テンプレート詳細（フィールド含む）
export interface TemplateWithFields extends Template {
  fields: FieldDefinition[];
}

// テンプレート作成データ
export interface TemplateCreateData {
  name: string;
  description?: string;
  fields?: FieldDefinition[];
}

// テンプレート更新データ
export interface TemplateUpdateData {
  name?: string;
  description?: string;
  isActive?: boolean;
  fields?: FieldDefinition[];
}

// デフォルト値
const defaultTemplateContext: TemplateContextType = {
  templates: [],
  loading: false,
  error: null,
  fetchTemplates: async () => {},
  getTemplate: async () => ({} as TemplateWithFields),
  createTemplate: async () => {},
  updateTemplate: async () => {},
  deleteTemplate: async () => {},
};

// コンテキスト作成
const TemplateContext = createContext<TemplateContextType>(defaultTemplateContext);

// コンテキストプロバイダー
export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // テンプレート一覧取得
  const fetchTemplates = async (activeOnly?: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      let url = '/api/templates';
      if (activeOnly) {
        url += '?isActive=true';
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'テンプレートの取得に失敗しました');
      }
      
      const data = await response.json();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message);
      console.error('テンプレート取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  // テンプレート詳細取得
  const getTemplate = async (id: string): Promise<TemplateWithFields> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch(`/api/templates/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'テンプレートの取得に失敗しました');
      }
      
      const template = await response.json();
      return template;
    } catch (err: any) {
      setError(err.message);
      console.error('テンプレート詳細取得エラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // テンプレート作成
  const createTemplate = async (data: TemplateCreateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'テンプレートの作成に失敗しました');
      }
      
      // テンプレート一覧を更新
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message);
      console.error('テンプレート作成エラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // テンプレート更新
  const updateTemplate = async (id: string, data: TemplateUpdateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || 'テンプレートの更新に失敗しました');
      }
      
      // テンプレート一覧を更新
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message);
      console.error('テンプレート更新エラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // テンプレート削除
  const deleteTemplate = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'テンプレートの削除に失敗しました');
      }
      
      // テンプレート一覧から削除したテンプレートを除外
      setTemplates(prev => prev.filter(template => template.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('テンプレート削除エラー:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    templates,
    loading,
    error,
    fetchTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
}

// カスタムフック
export const useTemplates = () => useContext(TemplateContext);
