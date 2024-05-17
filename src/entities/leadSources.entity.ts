import {
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity({ name: 'lead_sources' })
export class LeadSources {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy: Users;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
