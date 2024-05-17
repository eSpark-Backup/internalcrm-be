import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { CloudStorageService } from 'src/utils/file.storage';
import { UserModule } from 'src/user/user.module';
import { LeadSourceModule } from 'src/lead-sources/lead-sources.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leads } from 'src/entities/leads.entity';

@Module({
  imports: [UserModule, LeadSourceModule, TypeOrmModule.forFeature([Leads])],
  controllers: [LeadsController],
  providers: [LeadsService, CloudStorageService],
})
export class LeadsModule {}
