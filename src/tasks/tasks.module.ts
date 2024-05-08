import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from 'src/entities/tasks.entity';
import { CardsModule } from 'src/cards/cards.module';
import { TaskComments } from 'src/entities/taskComments.entity';

@Module({
  imports: [
    UserModule,
    CardsModule,
    TypeOrmModule.forFeature([Tasks, TaskComments]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
