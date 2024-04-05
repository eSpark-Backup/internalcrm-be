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
      throw new UnauthorizedException(`Username or password invalid`);
    }
    const isPassCorrect = await bcrypt.compare(
      userCreds.password,
      user.password,
    );
    if (!isPassCorrect) {
      throw new UnauthorizedException(`Username or password invalid`);
    }
    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });
    return { user, token };
  }
}
