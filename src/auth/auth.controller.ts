import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './auth-dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'Login',
  })
  @Post('/login')
  @HttpCode(200)
  async signin(@Body() reqData: LoginDTO) {
    const data = await this.userService.login(reqData);
    return {
      status: 'success',
      message: 'You have successfully logged in',
      data,
    };
  }
}
