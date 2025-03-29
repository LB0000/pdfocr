import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LearningModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  modelType!: string;

  @Column({ nullable: true })
  modelPath!: string;

  @Column({ type: 'simple-json', nullable: true })
  parameters!: Record<string, any>;

  @Column({ default: 'active' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
