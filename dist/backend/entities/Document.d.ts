import { User } from './User';
import { DocumentField } from './DocumentField';
export declare class Document {
    id: string;
    name: string;
    description: string;
    filePath: string;
    status: string;
    user: User;
    fields: DocumentField[];
    createdAt: Date;
    updatedAt: Date;
}
