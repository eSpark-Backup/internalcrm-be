import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { ProjectMembers } from './projectMembers.entity';

export type ProjectsObj = Omit<Projects, 'id' | 'createdAt'>;
@Entity({ name: 'projects' })
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startingDate: Date;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => ProjectMembers, (user) => user.projectId, { cascade: true })
  members?: ProjectMembers[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
