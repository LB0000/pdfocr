import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Document } from './Document';
import { User } from './User';

@Entity('correction_logs')
export class CorrectionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column()
  documentId: string;

  @Column({ type: 'text', nullable: true })
  fieldId: string;

  @Column({ type: 'text' })
  originalValue: string;

  @Column({ type: 'text' })
  correctedValue: string;

  @Column({ type: 'jsonb', nullable: true })
  correctionMetadata: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'correctedBy' })
  corrector: User;

  @Column()
  correctedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
