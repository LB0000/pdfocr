import { Document } from './Document';
import { User } from './User';
export declare class CorrectionLog {
    id: string;
    document: Document;
    user: User;
    fieldName: string;
    originalValue: string;
    correctedValue: string;
    createdAt: Date;
}
