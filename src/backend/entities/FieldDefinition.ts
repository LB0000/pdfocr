import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocumentTemplate } from './DocumentTemplate';

@Entity('field_definitions')
export class FieldDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  @Column({
    type: 'enum',
    enum: ['text', 'number', 'date', 'postal_code', 'phone', 'email', 'currency'],
    default: 'text'
  })
  fieldType: 'text' | 'number' | 'date' | 'postal_code' | 'phone' | 'email' | 'currency';

  @Column({ type: 'jsonb', nullable: true })
  validationRules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };

  @Column({ nullable: true })
  displayOrder: number;

  @ManyToOne(() => DocumentTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'templateId' })
  template: DocumentTemplate;

  @Column()
  templateId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
