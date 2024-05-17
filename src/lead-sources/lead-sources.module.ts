import { Module } from '@nestjs/common';
import { LeadSourcesController } from './lead-sources.controller';
import { LeadSourceService } from './lead-sources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadSources } from 'src/entities/leadSources.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([LeadSources])],
  controllers: [LeadSourcesController],
  providers: [LeadSourceService],
  exports: [LeadSourceService],
})
export class LeadSourceModule {}
