"use client";

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { DocumentProvider } from './DocumentContext';
import { TemplateProvider } from './TemplateContext';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <DocumentProvider>
        <TemplateProvider>
          {children}
        </TemplateProvider>
      </DocumentProvider>
    </AuthProvider>
  );
};
