import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { UserModule } from 'src/user/user.module';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projects } from 'src/entities/projects.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Projects])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
