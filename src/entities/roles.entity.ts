import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRoles {
  super = 'super-admin',
  lead = 'team-lead',
  member = 'member',
}
@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserRoles })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  superuser: boolean;
}
