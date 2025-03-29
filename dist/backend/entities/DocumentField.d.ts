import { Document } from './Document';
export declare class DocumentField {
    id: string;
    name: string;
    value: string;
    confidence: number;
    coordinates: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    document: Document;
    createdAt: Date;
    updatedAt: Date;
}
