import { Request, Response } from 'express';
export declare const getAllTemplates: (req: Request, res: Response) => Promise<void>;
export declare const getTemplateById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTemplate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
