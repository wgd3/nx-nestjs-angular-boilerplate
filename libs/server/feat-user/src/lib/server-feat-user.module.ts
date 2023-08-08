import { ServerDataAccessModule } from '@libs/server/data-access';
import { Module } from '@nestjs/common';

import { ServerFeatUserController } from './server-feat-user.controller';
import { ServerFeatUserService } from './server-feat-user.service';

@Module({
  imports: [ServerDataAccessModule],
  controllers: [ServerFeatUserController],
  providers: [ServerFeatUserService],
  exports: [ServerFeatUserService],
})
export class ServerFeatUserModule {}
