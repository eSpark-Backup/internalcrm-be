import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Projects } from './projects.entity';
import { Users } from './users.entity';

@Entity({ name: 'project_members' })
@Index(['userId', 'projectId'], { unique: true })
export class ProjectMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Projects, (project) => project.members)
  @JoinColumn({ name: 'projectId' })
  projectId: Projects;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId: Users;

  @DeleteDateColumn()
  deletedAt: Date;
}
