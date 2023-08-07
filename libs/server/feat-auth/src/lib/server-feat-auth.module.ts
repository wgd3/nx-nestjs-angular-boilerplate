import { Module } from '@nestjs/common';
import { ServerFeatAuthController } from './server-feat-auth.controller';
import { ServerFeatAuthService } from './server-feat-auth.service';

@Module({
  controllers: [ServerFeatAuthController],
  providers: [ServerFeatAuthService],
  exports: [ServerFeatAuthService],
})
export class ServerFeatAuthModule {}
