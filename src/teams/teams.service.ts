import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teams } from 'src/entities/teams.entity';
import { Repository } from 'typeorm';
import { CreateTeamDTO, UpdateTeamDTO } from './teams-dto';
import { UserService } from 'src/user/user.service';
import { UserRoles } from 'src/entities/roles.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Teams)
    private teamsRepo: Repository<Teams>,
    private userService: UserService,
  ) {}

  create(teamObj) {
    const newTeam = this.teamsRepo.create(teamObj);
    return this.teamsRepo.save(newTeam);
  }

  async createTeam(teamObj: CreateTeamDTO) {
    const user = await this.userService.getUserDetails(teamObj.head);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.create(teamObj);
  }

  async fetchTeams() {
    return this.teamsRepo.find({ where: { archived: false } });
  }

  async updateTeam(id: number, teamObj) {
    if (teamObj.head) {
      const user = await this.userService.getUserDetails(teamObj.head);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }
    if (Object.keys(teamObj).length) {
      const result = await this.teamsRepo.update(
        { id, archived: false },
        teamObj,
      );
      if (result.affected === 0) {
        throw new NotFoundException('Team not found!');
      }
    }
    return teamObj;
  }

  async deleteTeam(id: number) {
    return this.updateTeam(id, { archived: true });
  }
}
