// 共通の型定義
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'error';
export type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox';

// 座標の型定義
export interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ドキュメント関連の型定義
export interface Document {
  id: string;
  name: string;
  description?: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  fields?: Record<string, any>;
  confidenceScore?: number;
  ocrResult?: string | Record<string, any>;
}

export interface DocumentField {
  name: string;
  value: string;
  confidence: number;
}

export interface DocumentUploadData {
  name: string;
  description?: string;
  templateId?: string;
  file: File;
}

// テンプレート関連の型定義
export interface Template {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fields: TemplateField[];
}

export interface TemplateField {
  id: string;
  name: string;
  fieldType: FieldType;
  description?: string;
  options?: string[];
  required?: boolean;
  validationRegex?: string;
  displayOrder?: number;
  coordinates?: Coordinates;
}

export interface TemplateCreateData {
  name: string;
  description?: string;
  isActive?: boolean;
  fields?: TemplateField[];
}

export interface FieldDefinitionCreateData {
  name: string;
  description?: string;
  fieldType: FieldType;
  validationRegex?: string;
  coordinates?: Coordinates;
}

// APIレスポンスの型定義
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface DocumentResponse {
  documents: Document[];
}

export interface SingleDocumentResponse {
  document: Document;
}

export interface TemplateResponse {
  templates: Template[];
}

export interface SingleTemplateResponse {
  template: Template;
} 