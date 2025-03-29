"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  Template,
  TemplateContextType,
  TemplateField,
  TemplateCreateData,
  FieldDefinitionCreateData,
  TemplateResponse,
  SingleTemplateResponse,
  ApiResponse
} from '@/types/models';

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
  deleteTemplate: async () => {}
};

// コンテキストの作成
const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

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
    deleteTemplate
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

// カスタムフック
export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}
