import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { UserOrmEntity } from './entities/user.orm-entity';
import { UserOrmEntitySubscriber } from './subscribers/user.entity-subscriber';

const ormEventSubscribers: Provider[] = [UserOrmEntitySubscriber];

const entities: EntityClassOrSchema[] = [UserOrmEntity];

const typeormModule = TypeOrmModule.forFeature(entities);

@Module({
  imports: [typeormModule],
  providers: [...ormEventSubscribers],
  exports: [typeormModule],
})
export class DatabaseModule {}
