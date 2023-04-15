import { Module } from '@nestjs/common';
import { AuthModule } from '@src/auth/auth.module';
import { UsersModule } from '@src/user/user.module';
import { FacebookOauthController } from './facebook-oauth.controller';
import { FacebookStrategy } from './facebook-oauth.strategy';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [FacebookOauthController],
  providers: [FacebookStrategy],
})
export class FacebookOauthModule {}
