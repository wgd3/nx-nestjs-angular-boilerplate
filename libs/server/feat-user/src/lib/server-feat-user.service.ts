import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateUserDto, UserOrmEntity } from '@libs/server/data-access';
import { RoleType } from '@libs/shared/util-types';
import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServerFeatUserService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private userRepo: Repository<UserOrmEntity>
  ) {}

  async findUser(
    find: FindOptionsWhere<UserOrmEntity>
  ): Promise<UserOrmEntity | null> {
    return this.userRepo.findOneBy(find);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>
  ): Promise<UserOrmEntity | null> {
    const queryBuilder = this.userRepo.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(dto: CreateUserDto): Promise<UserOrmEntity> {
    const user = this.userRepo.create({ ...dto, role: RoleType.USER });
    await user.save();
    return user;
  }

  getUser() {
    throw new NotImplementedException();
  }

  async getUsers() {
    return this.userRepo.find();
  }

  async getUserByEmail(email: string): Promise<UserOrmEntity> {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User could not be found!`);
    }

    return user;
  }
}
