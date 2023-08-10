import { Module } from '@nestjs/common';
import { ServerUtilMailerService } from './server-util-mailer.service';

@Module({
  controllers: [],
  providers: [ServerUtilMailerService],
  exports: [ServerUtilMailerService],
})
export class ServerUtilMailerModule {}
