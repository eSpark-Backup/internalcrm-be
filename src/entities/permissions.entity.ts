import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'permissions' })
export class Permissions {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  showOnFrontend: boolean;
}
