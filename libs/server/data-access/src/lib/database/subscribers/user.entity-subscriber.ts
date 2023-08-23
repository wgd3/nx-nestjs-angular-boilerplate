import type {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MD5 } from 'crypto-js';
import { EventSubscriber } from 'typeorm';

import { AuthProviderType } from '@libs/shared/util-types';
import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { UserOrmEntity } from '../entities/user.orm-entity';

@EventSubscriber()
export class UserOrmEntitySubscriber
  implements EntitySubscriberInterface<UserOrmEntity>
{
  private readonly logger = new Logger(UserOrmEntitySubscriber.name);
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
        event.entity.password,
      );
    }

    // default to gravatars
    if (!event.entity.avatar && event.entity.email) {
      const emailHash = MD5(event.entity.email).toString();
      event.entity.avatar = `https://www.gravatar.com/avatar/${emailHash}`;
    }

    // set up a verification hash if the user is using local auth instead
    // of social auth
    if (event.entity.socialProvider === AuthProviderType.EMAIL) {
      const hash = crypto.randomBytes(64).toString('hex');
      event.entity.verificationHash = hash;
    }
  }

  async beforeUpdate({ entity, databaseEntity }: UpdateEvent<UserOrmEntity>) {
    // check for password updates
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
