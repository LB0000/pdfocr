"use client";

import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { useTemplates } from '@/context/TemplateContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const { documents, loading: documentsLoading, fetchDocuments } = useDocuments();
  const { templates, loading: templatesLoading, fetchTemplates } = useTemplates();
  
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [documentStats, setDocumentStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    error: 0
  });
  
  useEffect(() => {
    fetchDocuments();
    fetchTemplates();
  }, [fetchDocuments, fetchTemplates]);
  
  useEffect(() => {
    if (documents.length > 0) {
      // 最近のドキュメント（最大5件）
      const sorted = [...documents].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentDocuments(sorted.slice(0, 5));
      
      // ドキュメント統計
      const stats = {
        total: documents.length,
        pending: documents.filter(doc => doc.status === 'pending').length,
        processing: documents.filter(doc => doc.status === 'processing').length,
        completed: documents.filter(doc => doc.status === 'completed').length,
        error: documents.filter(doc => doc.status === 'error').length
      };
      setDocumentStats(stats);
    }
  }, [documents]);
  
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
  
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="mt-2 text-gray-600">
          ようこそ、{user?.name || 'ゲスト'}さん
        </p>
      </div>
      
      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">総ドキュメント数</h3>
          <p className="mt-2 text-3xl font-semibold">{documentStats.total}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">待機中</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">{documentStats.pending}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">処理中</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{documentStats.processing}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">完了</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{documentStats.completed}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">エラー</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{documentStats.error}</p>
        </div>
      </div>
      
      {/* クイックアクション */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold">クイックアクション</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link 
            href="/documents/upload"
            className="flex items-center justify-center p-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新規ドキュメントアップロード
          </Link>
          
          <Link 
            href="/documents"
            className="flex items-center justify-center p-4 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ドキュメント一覧を表示
          </Link>
          
          <Link 
            href="/templates/create"
            className="flex items-center justify-center p-4 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            新規テンプレート作成
          </Link>
          
          <Link 
            href="/templates"
            className="flex items-center justify-center p-4 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            テンプレート一覧を表示
          </Link>
        </div>
      </div>
      
      {/* 最近のドキュメント */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">最近のドキュメント</h2>
          <Link 
            href="/documents"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            すべて表示
          </Link>
        </div>
        
        {documentsLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        ) : recentDocuments.length === 0 ? (
          <div className="p-4 text-gray-500 bg-gray-50 rounded-md">
            ドキュメントがありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    ファイル名
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    ステータス
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    アップロード日時
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{document.fileName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(document.status)}`}>
                        {getStatusLabel(document.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(document.createdAt).toLocaleString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <Link 
                        href={`/documents/${document.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* テンプレート */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">テンプレート</h2>
          <Link 
            href="/templates"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            すべて表示
          </Link>
        </div>
        
        {templatesLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        ) : templates.length === 0 ? (
          <div className="p-4 text-gray-500 bg-gray-50 rounded-md">
            テンプレートがありません
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.slice(0, 3).map((template) => (
              <div key={template.id} className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {template.isActive ? '有効' : '無効'}
                  </span>
                </div>
                <p className="mb-4 text-xs text-gray-500 line-clamp-2">
                  {template.description || '説明はありません'}
                </p>
                <Link 
                  href={`/templates/${template.id}`}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  詳細を見る
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
