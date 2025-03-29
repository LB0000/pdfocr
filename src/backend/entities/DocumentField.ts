import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Document } from './Document';

@Entity()
export class DocumentField {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  value!: string;

  @Column({ nullable: true })
  confidence!: number;

  @Column({ nullable: true, type: 'simple-json' })
  coordinates!: { x: number; y: number; width: number; height: number };

  @ManyToOne(() => Document, document => document.fields)
  document!: Document;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
