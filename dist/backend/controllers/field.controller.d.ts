import { Request, Response } from 'express';
export declare const getFieldsByTemplateId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFieldById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createField: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateField: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteField: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
