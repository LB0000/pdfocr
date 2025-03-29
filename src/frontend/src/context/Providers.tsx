import { AuthProvider } from '@/context/AuthContext';
import { DocumentProvider } from '@/context/DocumentContext';
import { TemplateProvider } from '@/context/TemplateContext';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <DocumentProvider>
        <TemplateProvider>
          {children}
        </TemplateProvider>
      </DocumentProvider>
    </AuthProvider>
  );
}
