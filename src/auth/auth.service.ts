import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/user/entities/user.entity';
import { UsersService } from '@src/user/user.service';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { Token } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
    isSocialLogin = false,
  ): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    const { password, ...result } = user ?? {};
    if ((isSocialLogin && user) || (user && user.password === pass)) {
      return result;
    }
    return null;
  }

  async login(user: any) {
    return {
      ...this.generateTokens({
        userId: user?.id,
      }),
      role: user?.role?.name,
    };
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRY'),
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

 async validateJWTUser(userId: number) {
    const { password, ...user } = await this.usersService.findOne(userId);

    return user;
  }

  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      return new BadRequestException('Password do not match');
    }
    const user = await this.usersService.findOneByEmail(registerDto.email);
    if (user) {
      return new ConflictException('User already registered');
    }
    const newUser = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      passwordResetToken: null,
    });
    return {
      ...this.generateTokens({
        userId: newUser?.id + '',
      }),
    };
  }
}
