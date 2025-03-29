"use client";

import { useDocuments } from '@/context/DocumentContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export default function DocumentList() {
  const { documents, loading, error, fetchDocuments } = useDocuments();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDocuments().catch(err => {
      setErrorMessage('ドキュメントの読み込みに失敗しました');
      console.error(err);
    });
  }, [fetchDocuments]);
  
  useEffect(() => {
    if (error) {
      setErrorMessage(`エラーが発生しました: ${error}`);
    }
  }, [error]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-4">ドキュメント一覧</h1>
      
      {documents.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">ドキュメントがありません</p>
          <Link href="/documents/upload" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
            新規アップロード
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div key={doc.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold">{doc.title}</h2>
              <p className="text-gray-500 text-sm">{new Date(doc.createdAt).toLocaleDateString()}</p>
              <div className="mt-4">
                <Link href={`/documents/${doc.id}`} className="text-blue-500 hover:underline">
                  詳細を見る
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
