"use client";

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard/Dashboard';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="container p-6 mx-auto">
      <Suspense fallback={<div>読み込み中...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

function DashboardContent() {
  const { user, isLoading } = useAuth();
  
  if (!isLoading && !user) {
    redirect('/login');
  }
  
  return <Dashboard />;
}
