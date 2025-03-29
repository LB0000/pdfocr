"use client";

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import DocumentDetail from '@/components/documents/DocumentDetail';
import { Suspense } from 'react';

interface DocumentDetailPageProps {
  params: {
    id: string;
  };
}

export default function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  return (
    <div className="container p-6 mx-auto">
      <Suspense fallback={<div>読み込み中...</div>}>
        <DocumentDetailContent documentId={params.id} />
      </Suspense>
    </div>
  );
}

function DocumentDetailContent({ documentId }: { documentId: string }) {
  const { user, isLoading } = useAuth();
  
  if (!isLoading && !user) {
    redirect('/login');
  }
  
  return <DocumentDetail documentId={documentId} />;
}
