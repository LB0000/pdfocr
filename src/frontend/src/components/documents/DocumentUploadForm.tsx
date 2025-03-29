"use client";

import { useDocuments } from '@/context/DocumentContext';
import { useTemplates } from '@/context/TemplateContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { uploadDocument } = useDocuments();
  const { templates, fetchTemplates, isLoading: templatesLoading } = useTemplates();
  const router = useRouter();
  
  useEffect(() => {
    fetchTemplates(); // テンプレート一覧を取得
  }, [fetchTemplates]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setErrorMessage('ファイルを選択してください');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await uploadDocument({
        file,
        name: file.name,
        description: description || undefined,
        templateId: templateId || undefined
      });
      router.push('/documents');
    } catch (error: any) {
      setErrorMessage(error.message || 'ドキュメントのアップロードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-xl font-semibold">新規ドキュメントのアップロード</h2>
      
      {errorMessage && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-700">
            PDFファイル
          </label>
          <input
            type="file"
            id="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
          {file && (
            <p className="mt-1 text-sm text-gray-500">
              選択されたファイル: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
            説明（オプション）
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="template" className="block mb-2 text-sm font-medium text-gray-700">
            テンプレート（オプション）
          </label>
          <select
            id="template"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">テンプレートを選択</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {templatesLoading && <p className="mt-1 text-sm text-gray-500">テンプレート読み込み中...</p>}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isLoading || !file}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>
      </form>
    </div>
  );
}
