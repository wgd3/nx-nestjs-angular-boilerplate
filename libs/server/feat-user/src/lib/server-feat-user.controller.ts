import { Controller, Get, Post } from '@nestjs/common';
import { ServerFeatUserService } from './server-feat-user.service';
import { UUIDParam } from '@libs/server/util-common';
import { Uuid } from '@libs/shared/util-types';
import { ApiTags } from '@nestjs/swagger';

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

  @Post()
  async createUser() {
    return this.userService.createUser();
  }
}
