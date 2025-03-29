import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('learning_models')
export class LearningModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  modelPath: string;

  @Column({ type: 'jsonb', nullable: true })
  modelMetadata: any;

  @Column({ type: 'float', default: 0 })
  accuracy: number;

  @Column({
    type: 'enum',
    enum: ['training', 'active', 'archived'],
    default: 'training'
  })
  status: 'training' | 'active' | 'archived';

  @Column({ type: 'integer', default: 1 })
  version: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
