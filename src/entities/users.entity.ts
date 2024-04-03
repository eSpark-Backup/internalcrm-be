import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { Role } from './roles.entity';

export enum USER_GENDERS {
  M = 'M',
  F = 'F',
}
@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ type: 'enum', enum: USER_GENDERS })
  gender: USER_GENDERS;

  @Column({ unique: true })
  employee_id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Index()
  @Column({ length: 255 })
  password: string;

  @OneToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  roleId: Role;

  @Column({ length: 255 })
  job_title: string;

  @Column({ length: 255, nullable: true })
  image: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
