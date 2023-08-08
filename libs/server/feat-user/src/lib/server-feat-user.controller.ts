import { UUIDParam } from '@libs/server/util-common';
import { Uuid } from '@libs/shared/util-types';
import { Controller, Get } from '@nestjs/common';
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

  @Get('id')
  async getUser(@UUIDParam('id') userId: Uuid) {
    return this.userService.getUser();
  }
}
