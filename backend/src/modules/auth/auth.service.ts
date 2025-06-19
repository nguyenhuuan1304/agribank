import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register({ email, firstName, lastName, password }): Promise<User> {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new BadRequestException('Email đã tồn tại');

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      fullName: `${firstName} ${lastName}`,
      passwordHash,
      role: 'GDV_TTQT', // default role
    });

    return this.userRepo.save(user);
  }

  async login({ email, password }) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
