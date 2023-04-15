import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { Public } from '@src/auth/decorator/public.decorator';
import { UsersService } from '@src/user/user.service';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { FacebookOauthGuard } from './facebook-oauth.guard';

@Controller('facebook')
export class FacebookOauthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @Get()
  @UseGuards(FacebookOauthGuard)
  async facebookAuth(@Req() _req, @Res() res: Response) {
    // Guard redirects
    return res.redirect('/');
  }

  @Public()
  @UseGuards(FacebookOauthGuard)
  @Get('redirect')
  async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    let user = await this.authService.validateUser(
      (req?.user as any)?.email,
      null,
      true,
    );
    if (!user) {
      user = await this.userService.create({
        name: (req.user as any)?.name,
        email: (req.user as any)?.email,
        password: nanoid(),
        passwordResetToken: null,
      });
    }
    // For now, we'll just show the user object
    const tokens = await this.authService.login(user);

    return res.redirect(
      `http://localhost:3000/login?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&role=${user?.role?.name}`,
    );
  }
}
