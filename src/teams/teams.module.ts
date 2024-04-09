import { Module } from '@nestjs/common';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';
import { UserModule } from 'src/user/user.module';
import { Teams } from 'src/entities/teams.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Teams])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
