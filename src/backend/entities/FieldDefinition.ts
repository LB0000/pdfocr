import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { DocumentTemplate } from './DocumentTemplate';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox';

@Entity()
export class FieldDefinition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'enum', enum: ['text', 'number', 'date', 'select', 'checkbox'] })
  fieldType!: FieldType;

  @Column({ nullable: true })
  validationRegex!: string;

  @Column({ type: 'simple-json', nullable: true })
  coordinates?: { x: number; y: number; width: number; height: number };

  @Column({ type: 'simple-json', nullable: true })
  options?: string[];

  @Column({ default: false })
  required!: boolean;

  @ManyToOne(() => DocumentTemplate, template => template.fields)
  template!: DocumentTemplate;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
