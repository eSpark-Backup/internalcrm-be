import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMembers } from 'src/entities/projectMembers.entity';
import { Users } from 'src/entities/users.entity';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class ProjectMembersSubscriber
  implements EntitySubscriberInterface<ProjectMembers>
{
  constructor(
    dataSource: DataSource,
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return ProjectMembers;
  }

  async beforeInsert(event: InsertEvent<ProjectMembers>) {
    const user = await this.usersRepo.findOne({
      where: {
        id: event.entity.userId as unknown as number,
        isActive: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
  }
}
