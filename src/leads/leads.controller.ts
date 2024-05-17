import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
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
import { LeadsService } from './leads.service';
import { AuthGuard } from 'src/auth/auth-guard';
import { Roles } from 'src/auth/roles-guard';
import { UserRoles } from 'src/entities/roles.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLeadDTO, UpdateLeadDTO } from './leads-dto';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/users.entity';
import { fileRegex } from 'src/utils/constants';
import { ParamIdDTO } from 'src/utils/id-dto';
import { Response } from 'express';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Create a Lead',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('documentFile'))
  async createLead(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: +process.env.MAX_ASSET_UPLOAD_SIZE * 1024,
            message: `File cannot be greater than ${+process.env.MAX_ASSET_UPLOAD_SIZE / 1024} MBs`,
          }),
          new FileTypeValidator({ fileType: fileRegex }),
        ],
      }),
    )
    documentFile: Express.Multer.File,
    @Body() reqBody: CreateLeadDTO,
    @CurrentUser() user: Users,
  ) {
    const data = await this.leadsService.create(reqBody, documentFile, user);
    return {
      data,
      status: 'success',
      message: 'Lead source has been created successfully!',
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all Leads',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Get('')
  @HttpCode(200)
  async GetLeadSources(@CurrentUser() user: Users) {
    const data = await this.leadsService.getLeads(user);
    return {
      data,
      status: 'success',
      message: 'Leads have been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get a Lead by ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Get(':id')
  @HttpCode(200)
  async GetLeadSourceById(@CurrentUser() user: Users, @Param() id: ParamIdDTO) {
    const data = await this.leadsService.getLeadById(user, id.id);
    return {
      data,
      status: 'success',
      message: 'Lead has been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update a Lead by ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('documentFile'))
  async updateLeadSource(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: +process.env.MAX_ASSET_UPLOAD_SIZE * 1024,
            message: `File cannot be greater than ${+process.env.MAX_ASSET_UPLOAD_SIZE / 1024} MBs`,
          }),
          new FileTypeValidator({ fileType: fileRegex }),
        ],
      }),
    )
    documentFile: Express.Multer.File,
    @CurrentUser()
    user: Users,
    @Param() id: ParamIdDTO,
    @Body() reqBody: UpdateLeadDTO,
  ) {
    await this.leadsService.update(reqBody, documentFile, user, id.id);
    return {
      status: 'success',
      message: 'Lead has been updated successfully!',
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete a Lead by ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Delete(':id')
  @HttpCode(200)
  async deleteLeadSource(@CurrentUser() user: Users, @Param() id: ParamIdDTO) {
    await this.leadsService.delete(user, id.id);
    return {
      status: 'success',
      message: 'Lead has been deleted successfully!',
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get Lead Document By ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Get(':id/document')
  @HttpCode(200)
  async getLeadDocument(
    @CurrentUser() user: Users,
    @Param() id: ParamIdDTO,
    @Res() res: Response,
  ) {
    const { file, fileName } = await this.leadsService.getLeadDocument(
      user,
      id.id,
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.set({
      'Content-Disposition': `attachment; filename="${fileName}"`, // Assuming the file name is known
    });
    file.pipe(res);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete a Lead by ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Get(':id/document/parse')
  @HttpCode(200)
  async parseCSVDoc(@CurrentUser() user: Users, @Param() id: ParamIdDTO) {
    const data = await this.leadsService.parseCSVDoc(user, id.id);
    return {
      data,
      status: 'success',
      message: 'CSV has been parsed successfully!',
    };
  }
}
