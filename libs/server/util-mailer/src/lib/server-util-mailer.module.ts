import { Global, Module } from '@nestjs/common';

import { ServerUtilMailerService } from './server-util-mailer.service';

@Global()
@Module({
  controllers: [],
  providers: [ServerUtilMailerService],
  exports: [ServerUtilMailerService],
})
export class ServerUtilMailerModule {}
