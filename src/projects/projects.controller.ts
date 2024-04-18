import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard';
import { Roles } from 'src/auth/roles-guard';
import { UserRoles } from 'src/entities/roles.entity';
import { ProjectsService } from './projects.service';
import {
  AddMembersDTO,
  CreateProjectDTO,
  ProjectAssetTypeDTO,
  UpdateProjectDTO,
  UploadAssetDTO,
  UserIdDTO,
} from './projects-dto';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/users.entity';
import { ParamIdDTO } from 'src/utils/id-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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

  @ApiOperation({
    summary: 'Upload asset',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/asset')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('asset'))
  async uploadAsset(
    @UploadedFile()
    asset: Express.Multer.File,
    @Body() reqBody: UploadAssetDTO,
  ) {
    await this.projectsService.uploadAsset(asset, reqBody);
    return {
      status: 'success',
      message: 'Asset has been uploaded!',
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
    summary: 'Fetch All Assets of a Project',
  })
  @UseGuards(AuthGuard)
  @Get(':id/assets')
  @HttpCode(200)
  async fetchAllAssets(
    @Query() queryParams: ProjectAssetTypeDTO,
    @Param() id: ParamIdDTO,
  ) {
    const data = await this.projectsService.fetchAssets(
      queryParams.type,
      id.id,
    );
    return {
      data,
      status: 'success',
      message: 'Assets have been fetched successfully!',
    };
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Download Asset of type = document',
  })
  @UseGuards(AuthGuard)
  @Get('asset/:id')
  @HttpCode(200)
  async downloadAsset(
    @Res({ passthrough: true }) res: Response,
    @Param() id: ParamIdDTO,
  ) {
    const { file, fileName } = await this.projectsService.downloadAsset(id.id);
    res.set({
      'Content-Disposition': `attachment; filename=${fileName}`,
    });
    return file;
  }
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Asset',
  })
  @UseGuards(AuthGuard)
  @Delete('asset/:id')
  @HttpCode(200)
  async deleteAsset(@Param() id: ParamIdDTO) {
    await this.projectsService.deleteAsset(id.id);
    return {
      status: 'success',
      message: 'Asset has been deleted successfully!',
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
