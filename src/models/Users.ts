import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './Roles';

@Index('UQ_97672ac88f789774dd47f7c8be3', ['email'], { unique: true })
@Index('UQ_c0d176bcc1665dc7cb60482c817', ['passwordResetToken'], {
  unique: true,
})
@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'email', unique: true })
  email: string;

  @Column('character varying', { name: 'role_id' })
  role_id: number;

  @Column('character varying', { name: 'password', select: false })
  password: string;

  @Column('character varying', {
    name: 'password_reset_token',
    nullable: true,
    unique: true,
    select: false,
  })
  passwordResetToken: string | null;

  @Column('date', { name: 'birthdate' })
  birthdate: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Roles, (roles) => roles.users, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Roles;
}
