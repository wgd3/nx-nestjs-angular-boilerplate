import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  imports: [ConfigModule],
  providers: [GoogleAuthService],
  exports: [GoogleAuthService],
  controllers: [GoogleAuthController],
})
export class GoogleAuthModule {}
