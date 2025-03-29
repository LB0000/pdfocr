"use client";

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useTemplates } from '@/context/TemplateContext';
import { useRouter } from 'next/navigation';

export default function CreateTemplatePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { createTemplate, loading: templateLoading } = useTemplates();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  if (!authLoading && !user) {
    redirect('/login');
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('テンプレート名は必須です');
      return;
    }
    
    try {
      setError(null);
      await createTemplate({
        name,
        description: description || undefined
      });
      router.push('/templates');
    } catch (err: any) {
      setError(err.message || 'テンプレートの作成に失敗しました');
    }
  };
  
  return (
    <div className="container p-6 mx-auto">
      <div className="w-full max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-xl font-semibold">新規テンプレート作成</h2>
        
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              テンプレート名 *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
              説明
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/templates')}
              className="px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={templateLoading || !name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {templateLoading ? '作成中...' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
