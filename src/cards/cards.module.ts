import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cards } from 'src/entities/cards.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ProjectsModule, UserModule, TypeOrmModule.forFeature([Cards])],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
