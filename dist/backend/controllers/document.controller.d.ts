import { Request, Response } from 'express';
export declare const getAllDocuments: (req: Request, res: Response) => Promise<void>;
export declare const getDocumentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
