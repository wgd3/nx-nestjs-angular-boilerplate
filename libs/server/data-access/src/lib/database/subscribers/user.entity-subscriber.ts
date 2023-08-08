import type {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MD5 } from 'crypto-js';
import { EventSubscriber } from 'typeorm';

import { InjectDataSource } from '@nestjs/typeorm';

import { UserOrmEntity } from '../entities/user.orm-entity';

@EventSubscriber()
export class UserOrmEntitySubscriber
  implements EntitySubscriberInterface<UserOrmEntity>
{
  constructor(@InjectDataSource() readonly dataSource: DataSource) {
    // allows for auto-injection in the TypeORM module instead of
    // specifying the `subscribers` property in `TypeORM.forRoot()`
    dataSource.subscribers.push(this);
  }

  listenTo(): typeof UserOrmEntity {
    return UserOrmEntity;
  }

  async beforeInsert(event: InsertEvent<UserOrmEntity>) {
    if (event.entity.password) {
      event.entity.password = await this.hashUserPassword(
        event.entity.password
      );
    }

    if (!event.entity.avatar && event.entity.email) {
      const emailHash = MD5(event.entity.email).toString();
      event.entity.avatar = `https://www.gravatar.com/avatar/${emailHash}`;
    }
  }

  async beforeUpdate({ entity, databaseEntity }: UpdateEvent<UserOrmEntity>) {
    // FIXME check event.databaseEntity.password
    if (
      entity &&
      entity['password'] &&
      entity['password'] !== databaseEntity.password
    ) {
      entity['password'] = await this.hashUserPassword(entity['password']);
    }
  }

  private async hashUserPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
