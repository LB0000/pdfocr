import { DocumentTemplate } from './DocumentTemplate';
export declare class FieldDefinition {
    id: string;
    name: string;
    description: string;
    fieldType: string;
    validationRegex: string;
    coordinates: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    template: DocumentTemplate;
    createdAt: Date;
    updatedAt: Date;
}
