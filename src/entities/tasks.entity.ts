import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Cards } from './cards.entity';

export enum TaskStatus {
  pending = 'pending',
  active = 'active',
  incomplete = 'incomplete',
  completed = 'completed',
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

  @ManyToOne(() => Cards, (card) => card.tasks)
  @JoinColumn({ name: 'cardId' })
  cardId: Cards;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.pending })
  status: TaskStatus;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Index()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
