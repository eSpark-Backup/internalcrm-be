import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Role } from './roles.entity';
import { Exclude } from 'class-transformer';

export enum UserGenders {
  M = 'M',
  F = 'F',
}
@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ type: 'enum', enum: UserGenders })
  gender: UserGenders;

  @Column({ unique: true })
  employee_id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude()
  @Index()
  @Column({ length: 255 })
  password: string;

  @ManyToOne(() => Role)
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
