import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth-guard';
import { Users } from 'src/entities/users.entity';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user role',
  })
  @UseGuards(AuthGuard)
  @Get('roles')
  @HttpCode(200)
  async getRole(@CurrentUser() user: Users) {
    const roleDetails = user.roleId;
    const data = {
      role: roleDetails.name,
      superUser: roleDetails.superuser,
      description: roleDetails.description ?? 'N/A',
    };
    return {
      data,
      status: 'success',
      message: 'Role has been fetched successfully!',
    };
  }
}
