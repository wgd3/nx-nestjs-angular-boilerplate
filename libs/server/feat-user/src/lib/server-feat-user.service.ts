import * as crypto from 'crypto';
import { FindOptionsWhere, Repository } from 'typeorm';

import {
  CreateUserDto,
  PaginationOptionsDto,
  PaginationService,
  UserOrmEntity,
} from '@libs/server/data-access';
import {
  IResetPasswordEmailContext,
  IVerifyEmailContext,
  ServerUtilMailerService,
} from '@libs/server/util-mailer';
import {
  AuthProviderType,
  IForgotPasswordPayload,
  IPaginatedResponse,
  IResetPasswordPayload,
  IUser,
  IUserEntity,
  RoleType,
  Uuid,
} from '@libs/shared/util-types';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServerFeatUserService extends PaginationService<UserOrmEntity> {
  private readonly logger = new Logger(ServerFeatUserService.name);

  constructor(
    @InjectRepository(UserOrmEntity)
    private userRepo: Repository<UserOrmEntity>,
    private emailService: ServerUtilMailerService,
  ) {
    super(UserOrmEntity.prototype, userRepo);
  }

  async findUser(
    find: FindOptionsWhere<UserOrmEntity>,
  ): Promise<UserOrmEntity | null> {
    return this.userRepo.findOneBy(find);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
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
    if (dto.socialProvider === AuthProviderType.EMAIL && dto.socialId) {
      throw new BadRequestException(
        `User can not provide a social ID while registering with an email address!`,
      );
    }

    // assume that since a 3rd party is being for registration, their email is verified already
    const user = this.userRepo.create({
      ...dto,
      role: RoleType.USER,
      isEmailVerified: dto.socialProvider !== AuthProviderType.EMAIL,
    });
    await user.save();

    if (dto.socialProvider === AuthProviderType.EMAIL) {
      // TODO: use config service to get frontend URL so that this doesn't point to the API
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

  async getUsers(
    paginationOptions?: PaginationOptionsDto,
  ): Promise<IPaginatedResponse<IUser>> {
    return this.paginate<IUser>(paginationOptions, (entity) => entity.toJSON());
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
    return await this.userRepo.findOneOrFail({ where: { id: userId } });
  }

  async forgotPassword(dto: IForgotPasswordPayload) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      this.logger.debug(
        `User ${dto.email} does not exist, skipping Forgot Password email`,
      );
      return;
    }
    if (!user.password && user.socialProvider !== AuthProviderType.EMAIL) {
      throw new UnprocessableEntityException(
        `User was created via social login, unable to reset password!`,
      );
    }
    const hash = crypto.randomBytes(64).toString('hex');
    user.verificationHash = hash;
    await user.save();

    // TODO: use config service to get frontend URL so that this doesn't point to the API
    const context: IResetPasswordEmailContext = {
      passwordResetLink: `http://localhost:3000/api/v1/auth/email/reset-password?code=${hash}`,
      title: 'Reset Your Password',
      username: user.firstName ?? user.email,
    };

    await this.emailService.sendMail({
      templatePath: 'dist/apps/server/assets/templates/reset-password.hbs',
      context,
      to: user.email,
      subject: 'Reset Your Password',
    });
  }

  async resetPassword(dto: IResetPasswordPayload & { code: string }) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      this.logger.debug(
        `User ${dto.email} does not exist, no password to reset!`,
      );
      throw new UnprocessableEntityException(`Unable to reset password`);
    }
    if (user.verificationHash !== dto.code) {
      this.logger.error(
        `User ${dto.email} is trying to reset their password with an invalid verification code!`,
      );
      throw new UnprocessableEntityException(`Verification code is not valid`);
    }
    this.logger.log(`Updating password for user ${dto.email}`);
    user.password = dto.password;
    user.verificationHash = null;
    await user.save();
  }

  async deleteUser(userId: Uuid): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(
        `Request received to delete user ${userId} - but user does not exist!`,
      );
      throw new UnprocessableEntityException(`Error deleting user`);
    }
    await user.remove();
  }
}
