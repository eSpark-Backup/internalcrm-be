import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects, ProjectsObj } from 'src/entities/projects.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import {
  AddMembersDTO,
  CreateProjectDTO,
  UpdateProjectDTO,
} from './projects-dto';
import { Users } from 'src/entities/users.entity';
import { ProjectMembers } from 'src/entities/projectMembers.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepo: Repository<Projects>,
    @InjectRepository(ProjectMembers)
    private projectMembersRepo: Repository<ProjectMembers>,
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
}
