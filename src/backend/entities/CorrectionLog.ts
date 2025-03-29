import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Document } from './Document';
import { User } from './User';

@Entity()
export class CorrectionLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Document)
  document!: Document;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  fieldName!: string;

  @Column({ nullable: true })
  originalValue!: string;

  @Column({ nullable: true })
  correctedValue!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
