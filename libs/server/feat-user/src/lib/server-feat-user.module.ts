import { Module } from '@nestjs/common';
import { ServerFeatUserController } from './server-feat-user.controller';
import { ServerFeatUserService } from './server-feat-user.service';

@Module({
  controllers: [ServerFeatUserController],
  providers: [ServerFeatUserService],
  exports: [ServerFeatUserService],
})
export class ServerFeatUserModule {}
