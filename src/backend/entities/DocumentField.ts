import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Document } from './Document';
import { User } from './User';
import { FieldDefinition } from './FieldDefinition';

@Entity('document_fields')
export class DocumentField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column()
  documentId: string;

  @ManyToOne(() => FieldDefinition, { nullable: true })
  @JoinColumn({ name: 'fieldDefinitionId' })
  fieldDefinition: FieldDefinition;

  @Column({ nullable: true })
  fieldDefinitionId: string;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  originalValue: string;

  @Column({ type: 'float', default: 0 })
  confidenceScore: number;

  @Column({ default: false })
  isManuallyEdited: boolean;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'lastEditedBy' })
  editor: User;

  @Column({ nullable: true })
  lastEditedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
