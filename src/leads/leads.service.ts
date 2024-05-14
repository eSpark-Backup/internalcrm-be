import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeadDTO, UpdateLeadDTO } from './leads-dto';
import { CloudStorageService } from 'src/utils/file.storage';
import { leadsDocsFolder } from 'src/utils/constants';
import { LeadSourceService } from 'src/lead-sources/lead-sources.service';
import { Users } from 'src/entities/users.entity';
import { extname } from 'path';
import { fromBuffer } from 'file-type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leads } from 'src/entities/leads.entity';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';
@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Leads)
    private leadsRepo: Repository<Leads>,
    private fileStorage: CloudStorageService,
    private leadSourceService: LeadSourceService,
  ) {}
  async create(data: CreateLeadDTO, file: Express.Multer.File, user: Users) {
    const fileType = await fromBuffer(file.buffer);
    if (fileType?.ext !== 'xlsx' && fileType !== undefined) {
      throw new BadRequestException('File format not supported');
    }
    const leadSource = await this.leadSourceService.getLeadSourceById(
      user,
      data.sourceId,
    );
    if (!leadSource) {
      throw new NotFoundException('Lead Source Not Found!');
    }
    const resource = file.originalname;
    const directoryPath = leadsDocsFolder;
    const lead = this.leadsRepo.create({
      createdBy: { id: user.id },
      documentName: resource,
      sourceId: { id: leadSource.id },
    });
    const savedLead = await this.leadsRepo.save(lead);
    const filePath = `${directoryPath}/${resource}_${savedLead.id}${extname(file.originalname)}`;
    await this.fileStorage.upload(filePath, file.buffer);
    return savedLead;
  }
  getLeads(user: Users) {
    return this.leadsRepo.find({ where: { createdBy: { id: user.id } } });
  }
  getLeadById(user: Users, id: number) {
    return this.leadsRepo.findOne({
      where: { id, createdBy: { id: user.id } },
    });
  }
  getLeadWithSource(user: Users, id: number) {
    return this.leadsRepo.findOne({
      where: { id, createdBy: { id: user.id } },
      relations: { sourceId: true },
    });
  }
  async update(
    data: UpdateLeadDTO,
    file: Express.Multer.File,
    user: Users,
    id: number,
  ) {
    const lead = await this.getLeadWithSource(user, id);
    if (!lead) {
      throw new NotFoundException('Lead Not Found!');
    }
    let leadSource = lead.sourceId;
    if (data.sourceId) {
      leadSource = await this.leadSourceService.getLeadSourceById(
        user,
        data.sourceId,
      );
      if (!leadSource) {
        throw new NotFoundException('Lead Source Not Found!');
      }
    }
    const resource = file?.originalname ?? lead.documentName;
    const directoryPath = leadsDocsFolder;
    if (file) {
      const fileType = await fromBuffer(file.buffer);
      if (fileType?.ext !== 'xlsx' && fileType !== undefined) {
        throw new BadRequestException('File format not supported');
      }
      const deleteFilePath = `${directoryPath}/${lead.documentName}_${lead.id}${extname(lead.documentName)}`;
      await this.fileStorage.delete(deleteFilePath);
      const uploadFilePath = `${directoryPath}/${resource}_${lead.id}${extname(file.originalname)}`;
      await this.fileStorage.upload(uploadFilePath, file.buffer);
    }
    return this.leadsRepo.save({
      ...lead,
      documentName: resource,
      sourceId: { id: leadSource.id },
    });
  }
  async delete(user: Users, id: number) {
    const lead = await this.getLeadById(user, id);
    if (!lead) {
      throw new NotFoundException('Lead not found!');
    }
    return this.leadsRepo.softRemove({
      id,
      createdBy: { id: user.id },
    });
  }
  async getLeadDocument(user: Users, id: number) {
    const lead = await this.getLeadById(user, id);
    if (!lead) {
      throw new NotFoundException('Lead Not Found!');
    }
    const directoryPath = leadsDocsFolder;
    const filePath = `${directoryPath}/${lead.documentName}_${lead.id}${extname(lead.documentName)}`;
    const file = await this.fileStorage.download(filePath);
    const readable = file.Body as unknown as Readable;
    return { file: readable, fileName: lead.documentName };
  }

  async parseCSVDoc(user: Users, id: number) {
    const { file, fileName } = await this.getLeadDocument(user, id);
    const ext = extname(fileName);
    if (ext !== '.csv') {
      throw new BadRequestException('Document is not CSV');
    }
    const results = [];
    return new Promise((resolve, reject) => {
      file
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
