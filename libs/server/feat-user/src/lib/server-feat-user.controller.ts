import { UpdateUserDto } from '@libs/server/data-access';
import { Auth, UUIDParam } from '@libs/server/util-common';
import { RoleType, Uuid } from '@libs/shared/util-types';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ServerFeatUserService } from './server-feat-user.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class ServerFeatUserController {
  constructor(private userService: ServerFeatUserService) {}

  @Get('')
  async getUsers() {
    return this.userService.getUsers();
  }

  /**
   * TODO: make sure the userId in URL matches ID in token OR that requesting user is an admin
   * @param userId
   * @returns
   */
  @Get(':id')
  async getUser(@UUIDParam('id') userId: Uuid) {
    return this.userService.getUser(userId);
  }

  @Patch(':id')
  @Auth([RoleType.ADMIN, RoleType.USER])
  async updateUser(
    @Param('id', new ParseUUIDPipe()) id: Uuid,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.updateUser(id, dto);
  }
}
