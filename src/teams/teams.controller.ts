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
import { CreateTeamDTO, UpdateTeamDTO } from './teams-dto';
import { TeamService } from './teams.service';
import { ParamIdDTO } from 'src/utils/id-dto';

@ApiTags('Teams')
@Controller('teams')
export class TeamController {
  constructor(private teamService: TeamService) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a Team',
  })
  @UseGuards(AuthGuard)
  @Roles([UserRoles.super])
  @Post('')
  @HttpCode(200)
  async createTeam(@Body() reqBody: CreateTeamDTO) {
    const data = await this.teamService.createTeam(reqBody);
    return {
      data,
      status: 'success',
      message: 'Team has been created successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fetch all Teams',
  })
  @UseGuards(AuthGuard)
  @Roles([UserRoles.super])
  @Get('')
  @HttpCode(200)
  async fetchTeams() {
    const data = await this.teamService.fetchTeams();
    return {
      data,
      status: 'success',
      message: 'Teams have been fetched successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Team Details',
  })
  @UseGuards(AuthGuard)
  @Roles([UserRoles.super])
  @Patch(':id')
  @HttpCode(200)
  async updateTeam(@Param() id: ParamIdDTO, @Body() reqBody: UpdateTeamDTO) {
    const data = await this.teamService.updateTeam(id.id, reqBody);
    return {
      data,
      status: 'success',
      message: 'Team has been updated successfully!',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Team',
  })
  @UseGuards(AuthGuard)
  @Roles([UserRoles.super])
  @Delete(':id')
  @HttpCode(200)
  async deleteTeam(@Param() id: ParamIdDTO) {
    await this.teamService.deleteTeam(id.id);
    return {
      status: 'success',
      message: 'Team has been deleted successfully!',
    };
  }
}
