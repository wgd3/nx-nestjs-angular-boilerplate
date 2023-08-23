import { SkipAuth } from '@libs/server/util-common';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller({ path: 'health', version: '1' })
@ApiTags('Health')
export class ServerFeatureHealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @SkipAuth()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
