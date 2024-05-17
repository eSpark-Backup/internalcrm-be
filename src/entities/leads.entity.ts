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
import { LeadSources } from './leadSources.entity';

@Entity({ name: 'lead' })
export class Leads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  documentName: string;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy: Users;

  @Column({ type: 'json', default: null })
  metaData: {};

  @ManyToOne(() => LeadSources, { nullable: false })
  @JoinColumn({ name: 'sourceId' })
  sourceId: LeadSources;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
