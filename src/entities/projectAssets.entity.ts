import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Projects } from './projects.entity';

export enum ProjectAssetType {
  link = 'link',
  document = 'document',
}

@Entity({ name: 'project_assets' })
export class ProjectAssets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  resource: string;

  @Column({
    type: 'enum',
    enum: ProjectAssetType,
    default: ProjectAssetType.link,
  })
  type: ProjectAssetType;

  @ManyToOne(() => Projects)
  @JoinColumn({ name: 'projectId' })
  projectId: Projects;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
