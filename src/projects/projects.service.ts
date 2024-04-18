import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects, ProjectsObj } from 'src/entities/projects.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  AddMembersDTO,
  CreateProjectDTO,
  UpdateProjectDTO,
  UploadAssetDTO,
} from './projects-dto';
import { Users } from 'src/entities/users.entity';
import { ProjectMembers } from 'src/entities/projectMembers.entity';
import { extname, join } from 'path';
import { createReadStream, promises } from 'fs';
import {
  ProjectAssetType,
  ProjectAssets,
} from 'src/entities/projectAssets.entity';
import { assetsFolder } from 'src/utils/constants';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepo: Repository<Projects>,
    @InjectRepository(ProjectMembers)
    private projectMembersRepo: Repository<ProjectMembers>,
    @InjectRepository(ProjectAssets)
    private projectAssetsRepo: Repository<ProjectAssets>,
    private userService: UserService,
  ) {}
  create(projectObj: ProjectsObj) {
    const newProject = this.projectsRepo.create(projectObj);
    return this.projectsRepo.save(newProject);
  }
  async createProject(projectObj: CreateProjectDTO, currentUser: Users) {
    const user = await this.userService.getUserDetails(currentUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.create({ ...projectObj, createdBy: user });
  }

  async fetchProjects() {
    return this.projectsRepo.find();
  }

  async updateProject(projectObj: UpdateProjectDTO, user: Users, id: number) {
    const project = await this.projectsRepo.findOne({
      where: { id, createdBy: user },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    this.projectsRepo.save({ ...project, ...projectObj });
    return projectObj;
  }

  async deleteProject(user: Users, id: number) {
    const project = await this.projectsRepo.findOne({
      where: { id, createdBy: user },
      relations: ['members'],
    });
    if (!project) {
      throw new NotFoundException('Project not found!');
    }
    return this.projectsRepo.softRemove(project);
  }

  async addMembers(membersObj: AddMembersDTO) {
    const project = await this.projectsRepo.findOne({
      where: { id: membersObj.projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found!');
    }
    const members: any = membersObj.userIds.map((userId) => {
      return {
        projectId: membersObj.projectId,
        userId,
      };
    });
    const newMembers = this.projectMembersRepo.create(members);
    await this.projectMembersRepo.insert(newMembers);
    return newMembers;
  }

  async getMembers(user: Users, id: number) {
    return this.projectMembersRepo.find({
      where: { projectId: { id } },
      relations: ['userId'],
    });
  }

  async deleteMember(user: Users, projectId: number, userId: number) {
    const member = await this.projectMembersRepo.findOne({
      where: {
        projectId: { createdBy: user, id: projectId },
        userId: { id: userId },
      },
    });
    if (!member) {
      throw new NotFoundException('Member not found!');
    }
    return this.projectMembersRepo.softRemove(member);
  }

  async uploadAsset(file: Express.Multer.File, data: UploadAssetDTO) {
    if (data.type === ProjectAssetType.document && !file) {
      throw new BadRequestException('Asset is required if type is document');
    }
    const project = await this.projectsRepo.findOne({
      where: { id: data.projectId },
    });
    if (!project) {
      throw new NotFoundException('Project nout found!');
    }
    let resource: string;
    if (file && data.type === ProjectAssetType.document) {
      resource = file.originalname;
      const directoryPath = assetsFolder;
      const filePath = join(
        directoryPath,
        `${resource}_${data.projectId}${extname(file.originalname)}`,
      );
      try {
        await promises.access(directoryPath);
      } catch (error) {
        if (error.code === 'ENOENT') {
          await promises.mkdir(directoryPath, { recursive: true });
        } else {
          throw error;
        }
      }
      await promises.writeFile(filePath, file.buffer);
    } else if (!data.link) {
      throw new BadRequestException('Pleas provide link');
    } else {
      resource = data.link;
    }
    const asset = this.projectAssetsRepo.create({
      projectId: project,
      resource,
      type: data.type,
    });
    await this.projectAssetsRepo.save(asset);
  }

  async fetchAssets(type: ProjectAssetType, projectId: number) {
    return this.projectAssetsRepo.find({
      where: { type, projectId: { id: projectId } },
    });
  }

  async downloadAsset(assetId: number) {
    const asset = await this.projectAssetsRepo.findOne({
      where: { id: assetId, type: ProjectAssetType.document },
      relations: ['projectId'],
    });
    if (!asset) {
      throw new NotFoundException('Asset not found!');
    }
    const directoryPath = assetsFolder;
    const filePath = join(
      directoryPath,
      `${asset.resource}_${asset.projectId.id}${extname(asset.resource)}`,
    );
    try {
      await promises.access(filePath);
    } catch (error) {
      throw new NotFoundException('File not found!');
    }
    const file = createReadStream(filePath);
    return { file: new StreamableFile(file), fileName: asset.resource };
  }

  async deleteAsset(assetId: number) {
    const asset = await this.projectAssetsRepo.findOne({ where: { id: assetId } });
    if(!asset){
      throw new NotFoundException("Asset not found")
    }
    return this.projectAssetsRepo.softRemove(asset);
  }
}
