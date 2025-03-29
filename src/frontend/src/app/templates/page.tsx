"use client";

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import TemplateList from '@/components/templates/TemplateList';
import { Suspense } from 'react';

export default function TemplatesPage() {
  return (
    <div className="container p-6 mx-auto">
      <Suspense fallback={<div>読み込み中...</div>}>
        <TemplatesContent />
      </Suspense>
    </div>
  );
}

function TemplatesContent() {
  const { user, isLoading } = useAuth();
  
  if (!isLoading && !user) {
    redirect('/login');
  }
  
  return <TemplateList />;
}
