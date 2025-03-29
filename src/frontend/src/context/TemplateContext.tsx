"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiResponse, TemplateResponse, SingleTemplateResponse } from '@/types/api';

// テンプレートコンテキストの型定義
interface TemplateContextType {
  templates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  fetchTemplate: (id: string) => Promise<Template>;
  createTemplate: (data: TemplateCreateData) => Promise<Template>;
  updateTemplate: (id: string, data: Partial<Template>) => Promise<Template>;
  deleteTemplate: (id: string) => Promise<void>;
  addFieldDefinition: (templateId: string, field: FieldDefinitionCreateData) => Promise<void>;
  updateFieldDefinition: (templateId: string, fieldId: string, data: Partial<FieldDefinition>) => Promise<void>;
  deleteFieldDefinition: (templateId: string, fieldId: string) => Promise<void>;
}

// テンプレート型定義
export interface Template {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fields: TemplateField[];
}

// テンプレートフィールド型定義
export interface TemplateField {
  id: string;
  name: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  description?: string;
  options?: string[];
  required?: boolean;
  validationRegex?: string;
  displayOrder?: number;
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
export type FieldDefinition = TemplateField;

// テンプレート作成データ型定義
export interface TemplateCreateData {
  name: string;
  description?: string;
  isActive?: boolean;
  fields?: TemplateField[];
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
  fetchTemplate: async () => ({ id: '', name: '', description: '', isActive: true, createdAt: '', updatedAt: '', fields: [] }),
  createTemplate: async () => ({ id: '', name: '', description: '', isActive: true, createdAt: '', updatedAt: '', fields: [] }),
  updateTemplate: async () => ({ id: '', name: '', description: '', isActive: true, createdAt: '', updatedAt: '', fields: [] }),
  deleteTemplate: async () => {},
  addFieldDefinition: async () => {},
  updateFieldDefinition: async () => {},
  deleteFieldDefinition: async () => {}
};

// コンテキストの作成
const TemplateContext = createContext<TemplateContextType | undefined>(defaultTemplateContext);

// コンテキストプロバイダーコンポーネント
export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('認証トークンが見つかりません');

      const response = await fetch('/api/templates', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json() as ApiResponse<TemplateResponse>;

      if (!response.ok) {
        throw new Error(data.message || 'テンプレートの取得に失敗しました');
      }

      setTemplates(data.data.templates);
    } catch (error) {
      console.error('Fetch templates error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('認証トークンが見つかりません');

      const response = await fetch(`/api/templates/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json() as ApiResponse<SingleTemplateResponse>;

      if (!response.ok) {
        throw new Error(data.message || 'テンプレートの取得に失敗しました');
      }

      setCurrentTemplate(data.data.template);
      return data.data.template;
    } catch (error) {
      console.error('Fetch template error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (data: TemplateCreateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('認証トークンが見つかりません');

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          fields: data.fields || [],
        }),
      });

      const responseData = await response.json() as ApiResponse<SingleTemplateResponse>;

      if (!response.ok) {
        throw new Error(responseData.message || 'テンプレートの作成に失敗しました');
      }

      setTemplates(prev => [...prev, responseData.data.template]);
      return responseData.data.template;
    } catch (error) {
      console.error('Create template error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplate = async (id: string, data: Partial<Template>) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('認証トークンが見つかりません');

      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json() as ApiResponse<SingleTemplateResponse>;

      if (!response.ok) {
        throw new Error(responseData.message || 'テンプレートの更新に失敗しました');
      }

      setTemplates(prev => prev.map(template => 
        template.id === id ? responseData.data.template : template
      ));
      setCurrentTemplate(responseData.data.template);
      return responseData.data.template;
    } catch (error) {
      console.error('Update template error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('認証トークンが見つかりません');

      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json() as ApiResponse<void>;

      if (!response.ok) {
        throw new Error(data.message || 'テンプレートの削除に失敗しました');
      }

      setTemplates(prev => prev.filter(template => template.id !== id));
      if (currentTemplate?.id === id) {
        setCurrentTemplate(null);
      }
    } catch (error) {
      console.error('Delete template error:', error);
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // フィールド定義の追加
  const addFieldDefinition = async (templateId: string, field: FieldDefinitionCreateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
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
      await fetchTemplate(templateId);
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
      const token = getAuthToken();
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
      await fetchTemplate(templateId);
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
      const token = getAuthToken();
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
      await fetchTemplate(templateId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // コンテキストの値
  const value: TemplateContextType = {
    templates,
    currentTemplate,
    isLoading,
    error,
    fetchTemplates,
    fetchTemplate,
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
}

// カスタムフック
export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
}

// フックのエクスポート
export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}
