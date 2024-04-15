import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Projects } from 'src/entities/projects.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateProjectDTO } from './projects-dto';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepo: Repository<Projects>,
    private userService: UserService,
  ) {}
  create(projectObj) {
    const newProject = this.projectsRepo.create(projectObj);
    return this.projectsRepo.save(newProject);
  }
  async createProject(projectObj: CreateProjectDTO, currentUser: Users) {
    const user = await this.userService.getUserDetails(currentUser.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.create({ ...projectObj, createdBy: user.id });
  }

  async fetchProjects() {
    return this.projectsRepo.find({ where: { archived: false } });
  }

  async updateProject(projectObj, user: Users, id: number) {
    const project = await this.projectsRepo.findOne({
      where: { id, archived: false, createdBy: user },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    this.projectsRepo.save({ ...project, ...projectObj });
    return projectObj;
  }

  async deleteProject(user: Users, id: number) {
    return this.updateProject({ archived: true }, user, id);
  }
}
