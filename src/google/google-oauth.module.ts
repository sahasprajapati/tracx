import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { UsersModule } from '@src/user/user.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy],
})
export class GoogleOauthModule {}
