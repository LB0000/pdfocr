"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// テンプレートコンテキストの型定義
interface TemplateContextType {
  templates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  fetchTemplateById: (id: string) => Promise<void>;
  getTemplate: (id: string) => Template | null;
  createTemplate: (data: TemplateCreateData) => Promise<void>;
  updateTemplate: (id: string, data: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  addFieldDefinition: (templateId: string, field: FieldDefinitionCreateData) => Promise<void>;
  updateFieldDefinition: (templateId: string, fieldId: string, data: Partial<FieldDefinition>) => Promise<void>;
  deleteFieldDefinition: (templateId: string, fieldId: string) => Promise<void>;
}

// テンプレート型定義
export interface Template {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// テンプレートフィールド型定義
export interface TemplateField {
  id: string;
  name: string;
  description?: string;
  fieldType: string;
  validationRegex?: string;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// テンプレートとフィールドを含む型定義
export interface TemplateWithFields extends Template {
  fields: TemplateField[];
}

// フィールド定義型定義
export interface FieldDefinition {
  id: string;
  name: string;
  description?: string;
  fieldType: string;
  validationRegex?: string;
  displayOrder?: number;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// テンプレート作成データ型定義
export interface TemplateCreateData {
  name: string;
  description: string;
  fields?: FieldDefinitionCreateData[];
}

// フィールド定義作成データ型定義
export interface FieldDefinitionCreateData {
  name: string;
  description?: string;
  fieldType: string;
  validationRegex?: string;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// デフォルト値の作成
const defaultTemplateContext: TemplateContextType = {
  templates: [],
  currentTemplate: null,
  isLoading: false,
  error: null,
  fetchTemplates: async () => {},
  fetchTemplateById: async () => {},
  getTemplate: () => null,
  createTemplate: async () => {},
  updateTemplate: async () => {},
  deleteTemplate: async () => {},
  addFieldDefinition: async () => {},
  updateFieldDefinition: async () => {},
  deleteFieldDefinition: async () => {}
};

// コンテキストの作成
const TemplateContext = createContext<TemplateContextType>(defaultTemplateContext);

// コンテキストプロバイダーコンポーネント
export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // トークンの取得
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // テンプレート一覧の取得
  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch('/api/templates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'テンプレートの取得に失敗しました');
      }
      
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // テンプレート詳細の取得
  const fetchTemplateById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/templates/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'テンプレートの取得に失敗しました');
      }
      
      setCurrentTemplate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // テンプレートの作成
  const createTemplate = async (data: TemplateCreateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          fields: data.fields || []
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'テンプレートの作成に失敗しました');
      }
      
      // 成功したら一覧を更新
      await fetchTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // テンプレートの更新
  const updateTemplate = async (id: string, data: Partial<Template>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'テンプレートの更新に失敗しました');
      }
      
      // 現在表示中のテンプレートを更新
      if (currentTemplate && currentTemplate.id === id) {
        setCurrentTemplate({ ...currentTemplate, ...data });
      }
      
      // 一覧も更新
      setTemplates(templates.map(template => 
        template.id === id ? { ...template, ...data } : template
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // テンプレートの削除
  const deleteTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'テンプレートの削除に失敗しました');
      }
      
      // 一覧から削除
      setTemplates(templates.filter(template => template.id !== id));
      
      // 現在表示中のテンプレートをクリア
      if (currentTemplate && currentTemplate.id === id) {
        setCurrentTemplate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // フィールド定義の追加
  const addFieldDefinition = async (templateId: string, field: FieldDefinitionCreateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/templates/${templateId}/fields`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(field)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'フィールド定義の追加に失敗しました');
      }
      
      // テンプレート詳細を再取得
      await fetchTemplateById(templateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // フィールド定義の更新
  const updateFieldDefinition = async (templateId: string, fieldId: string, data: Partial<FieldDefinition>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/templates/${templateId}/fields/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'フィールド定義の更新に失敗しました');
      }
      
      // テンプレート詳細を再取得
      await fetchTemplateById(templateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // フィールド定義の削除
  const deleteFieldDefinition = async (templateId: string, fieldId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('認証が必要です');
      }
      
      const response = await fetch(`/api/templates/${templateId}/fields/${fieldId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'フィールド定義の削除に失敗しました');
      }
      
      // テンプレート詳細を再取得
      await fetchTemplateById(templateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // テンプレートの取得
  const getTemplate = (id: string): Template | null => {
    return templates.find(template => template.id === id) || null;
  };

  // コンテキストの値
  const value: TemplateContextType = {
    templates,
    currentTemplate,
    isLoading,
    error,
    fetchTemplates,
    fetchTemplateById,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    addFieldDefinition,
    updateFieldDefinition,
    deleteFieldDefinition
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

// カスタムフック
export const useTemplate = () => useContext(TemplateContext);

// フックのエクスポート
export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};
