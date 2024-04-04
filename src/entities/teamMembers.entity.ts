import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Users } from './users.entity';
import { Teams } from './teams.entity';

@Entity({ name: 'team_members' })
@Index(['userId', 'teamId'])
export class TeamMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  userId: Users;

  @OneToOne(() => Teams)
  @JoinColumn({ name: 'teamId' })
  teamId: Teams;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
