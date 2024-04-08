import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/auth/auth-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepositry: Repository<Users>,
    private jwtService: JwtService,
  ) {}
  async login(userCreds: LoginDTO) {
    const user = await this.userRepositry.findOne({
      where: { email: userCreds.email },
    });
    if (!user) {
      throw new UnauthorizedException(`Email or Password invalid`);
    }
    const isPassCorrect = await bcrypt.compare(
      userCreds.password,
      user.password,
    );
    if (!isPassCorrect) {
      throw new UnauthorizedException(`Username or password invalid`);
    }
    if (!user.isActive) {
      throw new UnauthorizedException(`User is no longer active`);
    }
    const payload = { id: user.id, email: user.email };
    const expiresIn = userCreds.rememberMe
      ? process.env.JWT_EXPIRE_REMEMBER_ME
      : process.env.JWT_EXPIRE_NORMAL;
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    return { user, token };
  }
}
