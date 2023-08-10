import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ServerUtilMailerService } from './server-util-mailer.service';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [ServerUtilMailerService],
  exports: [ServerUtilMailerService],
})
export class ServerUtilMailerModule {}
