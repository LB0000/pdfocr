import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { DocumentTemplate } from './DocumentTemplate';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  fileName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  originalFilePath: string;

  @Column({ type: 'text', nullable: true })
  processedFilePath: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending'
  })
  status: 'pending' | 'processing' | 'completed' | 'error';

  @Column({ type: 'jsonb', nullable: true })
  ocrResult: any;

  @Column({ type: 'jsonb', nullable: true })
  layoutAnalysisResult: any;

  @Column({ type: 'float', default: 0 })
  confidenceScore: number;

  @ManyToOne(() => DocumentTemplate, { nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: DocumentTemplate;

  @Column({ nullable: true })
  templateId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedBy' })
  uploader: User;

  @Column()
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
