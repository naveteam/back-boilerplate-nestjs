import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('logs', { schema: 'public' })
export class Logs {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'level', nullable: true })
  level: string | null;

  @Column('character varying', { name: 'message', nullable: true })
  message: string | null;

  @Column('json', { name: 'meta' })
  meta: `object`;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
