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
import { IUser } from '@libs/shared/util-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ServerFeatAuthService {
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

  async generateRefreshToken(data: Pick<IUser, 'id'>): Promise<string> {
    return await this.jwtService.signAsync(
      {},
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
}
