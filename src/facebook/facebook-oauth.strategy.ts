import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FB_ID'),
      clientSecret: configService.get<string>('FB_SECRET'),
      callbackURL: configService.get<string>('FB_CALLBACK_URL'),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, name, emails } = profile;
    const user = {
      provider: 'facebook',
      providerId: id,
      email: emails[0].value,
      name: name.givenName + ' ' + name.familyName,
    };
    const payload = {
      ...user,
    };

    done(null, payload);
  }
}
