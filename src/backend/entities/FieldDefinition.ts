import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { DocumentTemplate } from './DocumentTemplate';

@Entity()
export class FieldDefinition {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  fieldType!: string;

  @Column({ nullable: true })
  validationRegex!: string;

  @Column({ type: 'simple-json', nullable: true })
  coordinates!: { x: number; y: number; width: number; height: number };

  @ManyToOne(() => DocumentTemplate, template => template.fields)
  template!: DocumentTemplate;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
