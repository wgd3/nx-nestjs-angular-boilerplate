import {
  CreateUserDto,
  TokenResponseDto,
  UserLoginDto,
} from '@libs/server/data-access';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
}
