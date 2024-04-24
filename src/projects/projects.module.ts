import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { UserModule } from 'src/user/user.module';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from 'src/entities/projects.entity';
import { ProjectMembers } from 'src/entities/projectMembers.entity';
import { ProjectMembersSubscriber } from 'src/subscribers/project-members';
import { Users } from 'src/entities/users.entity';
import { ProjectAssets } from 'src/entities/projectAssets.entity';
import { CloudStorageService } from 'src/utils/file.storage';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Projects, ProjectMembers, Users, ProjectAssets]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectMembersSubscriber, CloudStorageService],
})
export class ProjectsModule {}
