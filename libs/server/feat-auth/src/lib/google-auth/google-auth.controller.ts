import { SkipAuth } from '@libs/server/util-common';
import { AuthProviderType, ITokenResponse } from '@libs/shared/util-types';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ServerFeatAuthService } from '../server-feat-auth.service';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthLoginDto } from './google-login.dto';

@Controller({
  path: 'auth/google',
  version: '1',
})
@ApiTags('Authentication')
export class GoogleAuthController {
  constructor(
    private authService: ServerFeatAuthService,
    private googleService: GoogleAuthService,
  ) {}

  @Post('login')
  @SkipAuth()
  async login(@Body() dto: GoogleAuthLoginDto): Promise<ITokenResponse> {
    const user = await this.googleService.getProfileByToken(dto);
    return await this.authService.validateSocialUser(
      AuthProviderType.GOOGLE,
      user,
    );
  }
}
