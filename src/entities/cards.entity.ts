import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Projects } from './projects.entity';
import { Tasks } from './tasks.entity';

@Entity({ name: 'cards' })
export class Cards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Projects)
  @JoinColumn({ name: 'projectId' })
  projectId: Projects;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Tasks, (task) => task.cardId, { cascade: true })
  tasks?: Tasks[];

  @DeleteDateColumn()
  deletedAt: Date;
}
