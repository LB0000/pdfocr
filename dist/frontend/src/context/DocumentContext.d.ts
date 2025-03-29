import { ReactNode } from 'react';
interface DocumentContextType {
    documents: Document[];
    loading: boolean;
    error: string | null;
    fetchDocuments: () => Promise<void>;
    getDocument: (id: string) => Promise<Document>;
    uploadDocument: (file: File, description?: string, templateId?: string) => Promise<void>;
    updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
    deleteDocument: (id: string) => Promise<void>;
}
export interface Document {
    id: string;
    fileName: string;
    description?: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    originalFilePath?: string;
    processedFilePath?: string;
    ocrResult?: any;
    layoutAnalysisResult?: any;
    confidenceScore: number;
    templateId?: string;
    template?: any;
    createdAt: string;
    updatedAt: string;
}
export declare function DocumentProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useDocuments: () => DocumentContextType;
export {};
