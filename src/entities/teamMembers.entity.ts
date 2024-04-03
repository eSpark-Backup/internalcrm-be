import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Teams } from './teams.entity';

@Entity({ name: 'team_members' })
export class TeamMembers {
  @PrimaryGeneratedColumn()
  id: string;

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
