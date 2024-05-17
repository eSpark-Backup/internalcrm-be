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
import { Roles } from 'src/auth/roles-guard';
import { UserRoles } from 'src/entities/roles.entity';
import { LeadSourceService } from './lead-sources.service';
import { CreateLeadSourceDTO } from './lead-sources-dto';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { Users } from 'src/entities/users.entity';
import { AuthGuard } from 'src/auth/auth-guard';
import { ParamIdDTO } from 'src/utils/id-dto';

@ApiTags('Lead Sources')
@Controller('lead-sources')
export class LeadSourcesController {
  constructor(private leadSourceService: LeadSourceService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Create a Lead Source',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Post('')
  @HttpCode(200)
  async createLeadSource(
    @Body() reqBody: CreateLeadSourceDTO,
    @CurrentUser() user: Users,
  ) {
    const data = await this.leadSourceService.create(reqBody, user);
    return {
      data,
      status: 'success',
      message: 'Lead source has been created successfully!',
    };
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all Lead Sources',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Get('')
  @HttpCode(200)
  async GetLeadSources(@CurrentUser() user: Users) {
    const data = await this.leadSourceService.getLeadSources(user);
    return {
      data,
      status: 'success',
      message: 'Lead sources have been fetched successfully!',
    };
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get a Lead Source by ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Get(':id')
  @HttpCode(200)
  async GetLeadSourceById(@CurrentUser() user: Users, @Param() id: ParamIdDTO) {
    const data = await this.leadSourceService.getLeadSourceById(user, id.id);
    return {
      data,
      status: 'success',
      message: 'Lead source has been fetched successfully!',
    };
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update a Lead Source by ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Patch(':id')
  @HttpCode(200)
  async updateLeadSource(
    @CurrentUser() user: Users,
    @Param() id: ParamIdDTO,
    @Body() reqBody: CreateLeadSourceDTO,
  ) {
    await this.leadSourceService.update(reqBody, user, id.id);
    return {
      status: 'success',
      message: 'Lead source has been updated successfully!',
    };
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete a Lead Source by ID',
  })
  @Roles([UserRoles.super, UserRoles.lead])
  @Delete(':id')
  @HttpCode(200)
  async deleteLeadSource(@CurrentUser() user: Users, @Param() id: ParamIdDTO) {
    await this.leadSourceService.delete(user, id.id);
    return {
      status: 'success',
      message: 'Lead source has been deleted successfully!',
    };
  }
}
