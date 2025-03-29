"use client";

import { useDocuments, Document } from '@/context/DocumentContext';
import { useTemplates } from '@/context/TemplateContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentDetailProps {
  documentId: string;
}

export default function DocumentDetail({ documentId }: DocumentDetailProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [templateId, setTemplateId] = useState('');
  
  const { fetchDocumentById, updateDocument, deleteDocument } = useDocuments();
  const { templates, fetchTemplates } = useTemplates();
  const router = useRouter();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const doc = await fetchDocumentById(documentId);
        setDocument(doc);
        setDescription(doc.description || '');
        setTemplateId(doc.templateId || '');
        
        // テンプレート一覧を取得
        await fetchTemplates();
      } catch (err: any) {
        setError(err.message || 'ドキュメントの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [documentId, fetchDocumentById, fetchTemplates]);
  
  const handleUpdate = async () => {
    if (!document) return;
    
    try {
      setIsLoading(true);
      await updateDocument(documentId, {
        description,
        templateId: templateId || undefined
      });
      
      // 更新後の情報を再取得
      const updatedDoc = await fetchDocumentById(documentId);
      setDocument(updatedDoc);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'ドキュメントの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!document) return;
    
    if (!confirm('このドキュメントを削除してもよろしいですか？この操作は元に戻せません。')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteDocument(documentId);
      router.push('/documents');
    } catch (err: any) {
      setError(err.message || 'ドキュメントの削除に失敗しました');
      setIsLoading(false);
    }
  };
  
  // ステータスに応じたバッジの色を取得
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // ステータスの日本語表示
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待機中';
      case 'processing': return '処理中';
      case 'completed': return '完了';
      case 'error': return 'エラー';
      default: return status;
    }
  };
  
  if (isLoading && !document) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-red-700 bg-red-100 rounded-lg">
        エラーが発生しました: {error}
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="p-6 text-gray-700 bg-gray-100 rounded-lg">
        ドキュメントが見つかりません
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ドキュメント詳細</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push('/documents')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              一覧に戻る
            </button>
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isLoading}
                >
                  削除
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setDescription(document.description || '');
                    setTemplateId(document.templateId || '');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isLoading}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  保存
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-medium">基本情報</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">ファイル名</p>
                <p className="mt-1 text-sm text-gray-900">{document.fileName}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">ステータス</p>
                <p className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(document.status)}`}>
                    {getStatusLabel(document.status)}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">アップロード日時</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(document.createdAt).toLocaleString('ja-JP')}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">最終更新日時</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(document.updatedAt).toLocaleString('ja-JP')}
                </p>
              </div>
              
              {document.confidenceScore > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">認識精度</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {Math.round(document.confidenceScore * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-medium">詳細情報</h3>
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      説明
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                      テンプレート
                    </label>
                    <select
                      id="template"
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">テンプレートを選択</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">説明</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {document.description || '説明はありません'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">テンプレート</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {document.template ? document.template.name : 'テンプレートは設定されていません'}
                    </p>
                  </div>
                </>
              )}
              
              {document.status === 'completed' && (
                <div>
                  <p className="text-sm font-medium text-gray-500">OCR結果</p>
                  {document.ocrResult ? (
                    <div className="p-3 mt-1 overflow-auto text-sm text-gray-900 bg-gray-50 rounded-md max-h-60">
                      <pre>{typeof document.ocrResult === 'string' ? document.ocrResult : JSON.stringify(document.ocrResult, null, 2)}</pre>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">OCR結果はありません</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
