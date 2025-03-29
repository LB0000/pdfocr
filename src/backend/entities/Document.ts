import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { DocumentField } from './DocumentField';
import { DocumentTemplate } from './DocumentTemplate';

export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'error';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  filePath!: string;

  @Column({ type: 'enum', enum: ['pending', 'processing', 'completed', 'error'], default: 'pending' })
  status!: DocumentStatus;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => DocumentTemplate, { nullable: true })
  template!: DocumentTemplate;

  @OneToMany(() => DocumentField, field => field.document)
  fields!: DocumentField[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
