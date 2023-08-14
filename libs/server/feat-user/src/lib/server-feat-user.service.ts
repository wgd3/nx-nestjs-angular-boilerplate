import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateUserDto, UserOrmEntity } from '@libs/server/data-access';
import {
  IVerifyEmailContext,
  ServerUtilMailerService,
} from '@libs/server/util-mailer';
import { IUserEntity, RoleType, Uuid } from '@libs/shared/util-types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServerFeatUserService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private userRepo: Repository<UserOrmEntity>,
    private emailService: ServerUtilMailerService
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
    if (!dto.socialProvider && !dto.socialId) {
      const context: IVerifyEmailContext = {
        verificationLink: `http://localhost:3000/api/v1/auth/email/verify?code=${user.verificationHash}&email=${user.email}`,
        userEmailAddress: user.email,
        title: 'Verify Your Email',
        username: user.firstName ?? user.email,
      };
      await this.emailService.sendMail({
        templatePath: 'dist/apps/server/assets/templates/verify-email.hbs',
        context,
        to: user.email,
        subject: `Verify Your Email`,
      });
    }
    return user;
  }

  async getUser(userId: Uuid) {
    return await this.userRepo.findOneOrFail({ where: { id: userId } });
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

  async updateUser(userId: Uuid, data: Partial<IUserEntity>) {
    await this.userRepo.save({ id: userId, ...data });
  }
}
