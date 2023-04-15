import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './decorator/auth.guard';
import { JwtAuthGuard } from './decorator/jwt-auth.guard';
import { Public } from './decorator/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshToken } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() login: LoginDto, @Request() req) {
    return {
      data: await this.authService.login(req.user),
    };
  }

  @Public()
  @Post('register')
  async register(@Body() register: RegisterDto) {
    return {
      data: await this.authService.register(register),
    };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshToken, @Request() req) {
    return {
      data: this.authService.refreshToken(body.refreshToken),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      data: req.user,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req) {
    return {
      data: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async protectedData(@Request() req) {
    return {
      data: 'Protected data',
    };
  }
}
