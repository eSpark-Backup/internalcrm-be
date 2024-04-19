import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { extname } from 'path';
import {
  ProjectAssetType,
  ProjectAssets,
} from 'src/entities/projectAssets.entity';
import { assetsFolder } from 'src/utils/constants';
import { CloudStorageService } from 'src/utils/file.storage';

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
    private fileStorage: CloudStorageService,
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
      const filePath = `${directoryPath}/${resource}_${data.projectId}${extname(file.originalname)}`;
      await this.fileStorage.uploadAsset(file, filePath);
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
    const { id } = await this.projectAssetsRepo.save(asset);
    return { id };
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
    const filePath = `${directoryPath}/${asset.resource}_${asset.projectId.id}${extname(asset.resource)}`;
    const file = await this.fileStorage.downloadAsset(filePath);
    return {
      file,
      fileName: asset.resource,
    };
  }

  async deleteAsset(assetId: number) {
    const asset = await this.projectAssetsRepo.findOne({
      where: { id: assetId },
    });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return this.projectAssetsRepo.softRemove(asset);
  }
}
