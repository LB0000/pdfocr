import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import DocumentUploadForm from '@/components/documents/DocumentUploadForm';
import { Suspense } from 'react';

export default function DocumentUploadPage() {
  return (
    <div className="container p-6 mx-auto">
      <Suspense fallback={<div>読み込み中...</div>}>
        <DocumentUploadContent />
      </Suspense>
    </div>
  );
}

function DocumentUploadContent() {
  const { user, loading } = useAuth();
  
  if (!loading && !user) {
    redirect('/login');
  }
  
  return <DocumentUploadForm />;
}
