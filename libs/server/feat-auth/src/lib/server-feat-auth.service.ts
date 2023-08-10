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
  ENV_JWT_ACCESS_SECRET,
  ENV_JWT_REFRESH_EXPIRATION_TIME,
  ENV_JWT_REFRESH_SECRET,
} from '@libs/shared/util-constants';
import { IUserEntity, Uuid } from '@libs/shared/util-types';
import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
    data: Pick<IUserEntity, 'id' | 'email' | 'role'>
  ): Promise<string> {
    const payload = {
      email: data.email,
      role: data.role,
    };
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get(ENV_JWT_ACCESS_EXPIRATION_TIME),
      subject: data.id,
      secret: this.configService.get(ENV_JWT_ACCESS_SECRET),
    });
  }

  async generateRefreshToken(
    data: Pick<IUserEntity, 'id' | 'email' | 'role'>
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      {
        email: data.email,
        role: data.role,
      },
      {
        expiresIn: this.configService.get(ENV_JWT_REFRESH_EXPIRATION_TIME),
        subject: data.id,
        secret: this.configService.get(ENV_JWT_REFRESH_SECRET),
      }
    );
    await this.updateUserRefreshToken(data.id, token);
    return token;
  }

  async getTokens(
    data: Pick<IUserEntity, 'id' | 'email' | 'role'>
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
    if (!userId || refreshToken == '') {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUser(userId);
    const tokensMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken ?? ''
    );
    if (!tokensMatch) {
      throw new ForbiddenException(`Invalid refresh token`);
    }
    return await this.getTokens(user);
  }

  async updateUserRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateUser(userId, { refreshToken: hashed });
  }
}
