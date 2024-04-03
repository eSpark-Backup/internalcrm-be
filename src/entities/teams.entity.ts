import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity({ name: 'teams' })
export class Teams {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'head' })
  head: Users;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
