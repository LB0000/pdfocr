import { Document, Template, User } from '@/context/DocumentContext';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
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