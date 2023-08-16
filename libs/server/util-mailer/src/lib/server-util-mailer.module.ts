import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ServerUtilMailerService } from './server-util-mailer.service';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [ServerUtilMailerService],
  exports: [ServerUtilMailerService],
})
export class ServerUtilMailerModule {
  /**
   * NOTE: Potentially use `register()` to handle Mailer service configuration?
   */
  static register(opts: Record<string, unknown>): DynamicModule {
    if (opts) {
      // dynamic config?
    }
    return {
      module: ServerUtilMailerModule,
    };
  }
}
