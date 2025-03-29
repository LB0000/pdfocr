import { Request, Response, NextFunction } from 'express';
export default function errorHandler(err: Error & {
    status?: number;
    code?: string;
}, req: Request, res: Response, next: NextFunction): void;
