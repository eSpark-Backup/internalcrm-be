import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';
import { Tasks } from './tasks.entity';

@Entity({ name: 'task_comments' })
export class TaskComments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  comment: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  userId: Users;

  @ManyToOne(() => Tasks)
  @JoinColumn({ name: 'taskId' })
  taskId: Tasks;

  @Column({ type: 'boolean', default: false })
  edited: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  deleted: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
