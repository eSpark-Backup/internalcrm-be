import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
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
  UserIdsDTO,
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
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: +process.env.MAX_ASSET_UPLOAD_SIZE * 1024,
          message: `File cannot be greater than ${+process.env.MAX_ASSET_UPLOAD_SIZE / 1024} MBs`,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    asset: Express.Multer.File,
    @Body() reqBody: UploadAssetDTO,
  ) {
    const data = await this.projectsService.uploadAsset(asset, reqBody);
    return {
      data,
      status: 'success',
      message: 'Asset has been uploaded successfully!',
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
  async downloadAsset(@Param() id: ParamIdDTO, @Res() res: Response) {
    const { file, fileName } = await this.projectsService.downloadAsset(id.id);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.set({
      'Content-Disposition': `attachment; filename="${fileName}"`, // Assuming the file name is known
    });
    file.pipe(res);
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
    summary: 'Delete Members',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @UseGuards(AuthGuard)
  @Delete(':id/members')
  @HttpCode(200)
  async deleteMembers(
    @Body() members: UserIdsDTO,
    @CurrentUser() user: Users,
    @Param() id: ParamIdDTO,
  ) {
    await this.projectsService.deleteMembers(user, id.id, members.userIds);
    return {
      status: 'success',
      message: 'Members have been deleted successfully!',
    };
  }
}
