import {
  appConfig,
  dbConfig,
  googleConfig,
  mailerConfig,
  TypeormConfigService,
  validationSchema,
} from '@libs/server/util-common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../database.module';
import { UserDatabaseSeedService } from './users.database-seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, dbConfig, googleConfig, mailerConfig],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  providers: [UserDatabaseSeedService],
})
export class SeedModule {}
