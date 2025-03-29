"use client";

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import TemplateDetail from '@/components/templates/TemplateDetail';
import { Suspense } from 'react';

interface TemplateDetailPageProps {
  params: {
    id: string;
  };
}

export default function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  return (
    <div className="container p-6 mx-auto">
      <Suspense fallback={<div>読み込み中...</div>}>
        <TemplateDetailContent templateId={params.id} />
      </Suspense>
    </div>
  );
}

function TemplateDetailContent({ templateId }: { templateId: string }) {
  const { user, loading } = useAuth();
  
  if (!loading && !user) {
    redirect('/login');
  }
  
  return <TemplateDetail templateId={templateId} />;
}
