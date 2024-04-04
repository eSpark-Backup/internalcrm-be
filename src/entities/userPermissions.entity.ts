import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Users } from './users.entity';
import { Permissions } from './permissions.entity';

@Entity({ name: 'user_permissions' })
@Index(['userId', 'permissionId'])
export class UserPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  userId: Users;

  @OneToOne(() => Permissions)
  @JoinColumn({ name: 'permissionId' })
  permissionId: Permissions;
}
