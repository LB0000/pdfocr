// src/backend/schemas/document.schema.ts
import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100),
  templateId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100).optional(),
  templateId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'error']).optional(),
});

export const documentQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'error']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
