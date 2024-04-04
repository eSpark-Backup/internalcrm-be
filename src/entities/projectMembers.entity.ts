import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Projects } from './projects.entity';
import { Users } from './users.entity';

@Entity({ name: 'project_members' })
@Index(['userId', 'projectId'])
export class ProjectMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Projects)
  @JoinColumn({ name: 'projectId' })
  projectId: Projects;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  userId: Users;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
