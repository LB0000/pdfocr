import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { DocumentField } from './DocumentField';

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

  @Column({ default: 'pending' })
  status!: string;

  @ManyToOne(() => User)
  user!: User;

  @OneToMany(() => DocumentField, field => field.document)
  fields!: DocumentField[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
