import { Repository } from 'typeorm';

import { UserOrmEntity } from '@libs/server/data-access';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServerFeatUserService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private userRepo: Repository<UserOrmEntity>
  ) {}

  findUser() {
    throw new NotImplementedException();
  }

  findUserByEmailOrUsername() {
    throw new NotImplementedException();
  }

  createUser() {
    throw new NotImplementedException();
  }

  getUser() {
    throw new NotImplementedException();
  }

  getUsers() {
    throw new NotImplementedException();
  }
}
