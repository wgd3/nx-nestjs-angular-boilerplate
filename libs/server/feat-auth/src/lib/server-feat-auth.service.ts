import * as bcrypt from 'bcrypt';

import {
  CreateUserDto,
  TokenResponseDto,
  UserLoginDto,
  UserOrmEntity,
} from '@libs/server/data-access';
import { ServerFeatUserService } from '@libs/server/feat-user';
import { UserNotFoundException } from '@libs/server/util-common';
import {
  ENV_JWT_ACCESS_EXPIRATION_TIME,
  ENV_JWT_REFRESH_EXPIRATION_TIME,
  ENV_JWT_SECRET,
} from '@libs/shared/util-constants';
import { IUser, Uuid } from '@libs/shared/util-types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ServerFeatAuthService {
  private logger = new Logger(ServerFeatAuthService.name);
  constructor(
    private jwtService: JwtService,
    private userService: ServerFeatUserService,
    private configService: ConfigService
  ) {}

  async generateAccessToken(
    data: Pick<IUser, 'id' | 'email' | 'role'>
  ): Promise<string> {
    const payload = {
      email: data.email,
      role: data.role,
    };
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get(ENV_JWT_ACCESS_EXPIRATION_TIME),
      subject: data.id,
      secret: this.configService.get(ENV_JWT_SECRET),
    });
  }

  async generateRefreshToken(
    data: Pick<IUser, 'id' | 'email' | 'role'>
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        email: data.email,
        role: data.role,
      },
      {
        expiresIn: this.configService.get(ENV_JWT_REFRESH_EXPIRATION_TIME),
        subject: data.id,
        secret: this.configService.get(ENV_JWT_SECRET),
      }
    );
  }

  async getTokens(
    data: Pick<IUser, 'id' | 'email' | 'role'>
  ): Promise<TokenResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.generateAccessToken(data),
      await this.generateRefreshToken(data),
    ]);
    return new TokenResponseDto({ accessToken, refreshToken });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserOrmEntity> {
    const user = await this.userService.getUserByEmail(userLoginDto.email);

    const isPasswordValid = await bcrypt.compare(
      userLoginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async registerUser(dto: CreateUserDto): Promise<void> {
    await this.userService.createUser(dto);
  }

  async getMe(userId: Uuid) {
    const user = await this.userService.findUser({ id: userId });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    this.logger.debug(
      `Refreshing tokens using refresh token:\n${refreshToken}`
    );
    if (!userId || refreshToken == '') {
      throw new UnauthorizedException();
    }

    // TODO: update this once UserOrmEntity has a refreshToken property

    const user = await this.userService.getUser(userId);
    return await this.getTokens(user);
  }
}
