import { Repository } from 'typeorm';

import {
  AuthProviderType,
  ICreateUser,
  RoleType,
} from '@libs/shared/util-types';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randPassword, randUser } from '@ngneat/falso';

import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class UserDatabaseSeedService {
  private logger = new Logger(UserDatabaseSeedService.name);
  constructor(
    @InjectRepository(UserOrmEntity)
    private repo: Repository<UserOrmEntity>,
  ) {}

  /**
   * Add a basic admin user and base user
   */
  async seed() {
    const adminExists =
      (await this.repo.count({ where: { role: RoleType.ADMIN } })) > 0;
    if (!adminExists) {
      this.logger.log(`No admin user found, creating admin!`);
      const admin: ICreateUser = {
        firstName: 'Johnny',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: 'AdminPassword1!',
        role: RoleType.ADMIN,
        socialProvider: AuthProviderType.EMAIL,
        avatar: null,
        socialId: null,
      };
      await this.repo.save(this.repo.create(admin));
      this.logger.log(`Admin user created`);
    }

    const userExsist =
      (await this.repo.count({ where: { role: RoleType.USER } })) > 0;
    if (!userExsist) {
      this.logger.log(`No regular user found, creating user!`);
      const admin: ICreateUser = {
        firstName: 'Johnny',
        lastName: 'User',
        email: 'user@example.com',
        password: 'UserPassword1!',
        role: RoleType.USER,
        socialProvider: AuthProviderType.EMAIL,
        avatar: null,
        socialId: null,
      };
      await this.repo.save(this.repo.create(admin));
      this.logger.log(`User created`);
    }
  }

  async populateRandomUsers(count: number) {
    const users = randUser({ length: count }).map(
      (u): ICreateUser => ({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: `${randPassword({ size: 32 })}1!`,
        role: RoleType.USER,
        socialProvider: AuthProviderType.EMAIL,
        socialId: null,
        avatar: u.img,
      }),
    );
    await this.repo.save(users.map((u) => this.repo.create(u)));
    this.logger.log(
      `Created the following ${count} users:\n${users
        .map((u) => `${u.email} - ${u.password}`)
        .join('\n')}`,
    );
  }
}
