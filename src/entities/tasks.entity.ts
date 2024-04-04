import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';
import { Cards } from './cards.entity';

export enum TaskStatus {
  pending = 'pending',
}
@Entity({ name: 'tasks' })
export class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index()
  @Column({ type: 'timestamp' })
  startDate: Date;

  @Index()
  @Column({ type: 'timestamp' })
  endDate: Date;

  @Index()
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'assignedTo' })
  assignedTo: Users;

  @Index()
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'assignedBy' })
  assignedBy: Users;

  @ManyToOne(() => Cards)
  @JoinColumn({ name: 'cardId' })
  cardId: Cards;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.pending })
  status: TaskStatus;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Index()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
