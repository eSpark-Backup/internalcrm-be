import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard';
import { Roles } from 'src/auth/roles-guard';
import { UserRoles } from 'src/entities/roles.entity';
import { ProjectsService } from './projects.service';
import {
  AddMembersDTO,
  CreateProjectDTO,
  UpdateProjectDTO,
  UserIdDTO,
} from './projects-dto';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/users.entity';
import { ParamIdDTO } from 'src/utils/id-dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a Project',
  })
  @UseGuards(AuthGuard)
  @Roles([UserRoles.super, UserRoles.lead])
  @Post('')
  @HttpCode(200)
  async createProject(
    @Body() reqBody: CreateProjectDTO,
    @CurrentUser() user: Users,
  ) {
    const data = await this.projectsService.createProject(reqBody, user);
    return {
      data,
      status: 'success',
      message: 'Project has been created successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add Members',
  })
  @UseGuards(AuthGuard)
  @Roles([UserRoles.super, UserRoles.lead])
  @Post('/members')
  @HttpCode(200)
  async addMembers(@Body() reqBody: AddMembersDTO) {
    const data = await this.projectsService.addMembers(reqBody);
    return {
      data,
      status: 'success',
      message: 'Project has been created successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all Projects',
  })
  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(200)
  async fetchProjects() {
    const data = await this.projectsService.fetchProjects();
    return {
      data,
      status: 'success',
      message: 'Projects have been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Project Details',
  })
  @UseGuards(AuthGuard)
  @Roles([UserRoles.super, UserRoles.lead])
  @Patch(':id')
  @HttpCode(200)
  async updateProject(
    @Body() body: UpdateProjectDTO,
    @CurrentUser() user: Users,
    @Param() id: ParamIdDTO,
  ) {
    const data = await this.projectsService.updateProject(body, user, id.id);
    return {
      data,
      status: 'success',
      message: 'Project has been updated successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Project',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(200)
  async deleteProject(@CurrentUser() user: Users, @Param() id: ParamIdDTO) {
    await this.projectsService.deleteProject(user, id.id);
    return {
      status: 'success',
      message: 'Project has been deleted successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch All Members of a Project',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @UseGuards(AuthGuard)
  @Get(':id/members')
  @HttpCode(200)
  async fetchAllMembers(@CurrentUser() user: Users, @Param() id: ParamIdDTO) {
    const data = await this.projectsService.getMembers(user, id.id);
    return {
      data,
      status: 'success',
      message: 'Members have been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Member',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @UseGuards(AuthGuard)
  @Delete(':id/member/:userId')
  @HttpCode(200)
  async deleteMember(@CurrentUser() user: Users, @Param() id: UserIdDTO) {
    await this.projectsService.deleteMember(user, id.id, id.userId);
    return {
      status: 'success',
      message: 'Member has been deleted successfully!',
    };
  }
}
