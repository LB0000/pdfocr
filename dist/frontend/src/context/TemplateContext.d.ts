import { ReactNode } from 'react';
interface TemplateContextType {
    templates: Template[];
    loading: boolean;
    error: string | null;
    fetchTemplates: (activeOnly?: boolean) => Promise<void>;
    getTemplate: (id: string) => Promise<TemplateWithFields>;
    createTemplate: (data: TemplateCreateData) => Promise<void>;
    updateTemplate: (id: string, data: TemplateUpdateData) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
}
export interface Template {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    userId?: string;
    user?: any;
    createdAt: string;
    updatedAt: string;
}
export interface FieldDefinition {
    id?: string;
    name: string;
    description?: string;
    position?: any;
    fieldType: string;
    validationRules?: any;
    displayOrder?: number;
    templateId?: string;
}
export interface TemplateWithFields extends Template {
    fields: FieldDefinition[];
}
export interface TemplateCreateData {
    name: string;
    description?: string;
    fields?: FieldDefinition[];
}
export interface TemplateUpdateData {
    name?: string;
    description?: string;
    isActive?: boolean;
    fields?: FieldDefinition[];
}
export declare function TemplateProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useTemplates: () => TemplateContextType;
export {};
