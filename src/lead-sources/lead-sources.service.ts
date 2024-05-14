import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadSourceDTO } from './lead-sources-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeadSources } from 'src/entities/leadSources.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class LeadSourceService {
  constructor(
    @InjectRepository(LeadSources)
    private leadSourceRepo: Repository<LeadSources>,
  ) {}
  create(data: CreateLeadSourceDTO, user: Users) {
    const leadSource = this.leadSourceRepo.create({
      name: data.name,
      createdBy: { id: user.id },
    });
    return this.leadSourceRepo.save(leadSource);
  }
  getLeadSources(user: Users) {
    return this.leadSourceRepo.find({ where: { createdBy: { id: user.id } } });
  }
  getLeadSourceById(user: Users, id: number) {
    return this.leadSourceRepo.findOne({
      where: { id, createdBy: { id: user.id } },
    });
  }
  async update(data: CreateLeadSourceDTO, user: Users, id: number) {
    const result = await this.leadSourceRepo.update(
      {
        id,
        createdBy: { id: user.id },
      },
      data,
    );
    if (result.affected === 0) {
      throw new NotFoundException('Lead Source not found!');
    }
  }
  async delete(user: Users, id: number) {
    const leadSource = await this.getLeadSourceById(user, id);
    if (!leadSource) {
      throw new NotFoundException('Lead Source not found!');
    }
    return this.leadSourceRepo.softRemove({
      id,
      createdBy: { id: user.id },
    });
  }
}
