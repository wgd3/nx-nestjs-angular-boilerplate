import {
  CreateUserDto,
  TokenResponseDto,
  UserDto,
  UserLoginDto,
} from '@libs/server/data-access';
import { Auth, ReqUserId } from '@libs/server/util-common';
import { RoleType, Uuid } from '@libs/shared/util-types';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ServerFeatAuthService } from './server-feat-auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Authentication')
export class ServerFeatAuthController {
  constructor(private authService: ServerFeatAuthService) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TokenResponseDto,
  })
  async emailLogin(@Body() dto: UserLoginDto): Promise<TokenResponseDto> {
    const user = await this.authService.validateUser({
      email: dto.email,
      password: dto.password,
    });
    return this.authService.getTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  @Post('email/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnprocessableEntityResponse()
  async register(@Body() dto: CreateUserDto): Promise<void> {
    return this.authService.registerUser(dto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto })
  async getCurrentUser(@ReqUserId() userId: Uuid): Promise<UserDto> {
    Logger.debug(`Looking up user with ID: ${userId}`);
    return this.authService.getMe(userId);
  }
}
