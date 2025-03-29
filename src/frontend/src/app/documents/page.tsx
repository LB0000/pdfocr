"use client";

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import DocumentList from '@/components/documents/DocumentList';
import { Suspense } from 'react';

export default function DocumentsPage() {
  return (
    <div className="container p-6 mx-auto">
      <Suspense fallback={<div>読み込み中...</div>}>
        <DocumentsContent />
      </Suspense>
    </div>
  );
}

function DocumentsContent() {
  const { user, loading } = useAuth();
  
  if (!loading && !user) {
    redirect('/login');
  }
  
  return <DocumentList />;
}
