import {
  ApiPageOkResponse,
  PaginationOptionsDto,
  UpdateUserDto,
  UserDto,
} from '@libs/server/data-access';
import { Auth, UUIDParam } from '@libs/server/util-common';
import { RoleType, Uuid } from '@libs/shared/util-types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ServerFeatUserService } from './server-feat-user.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class ServerFeatUserController {
  private readonly logger = new Logger(ServerFeatUserController.name);
  constructor(private userService: ServerFeatUserService) {}

  @Get('')
  @Auth([RoleType.ADMIN])
  @ApiPageOkResponse({ type: UserDto })
  async getUsers(@Query() paginationOptions: PaginationOptionsDto) {
    return this.userService.getUsers(paginationOptions);
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
    @Body() dto: UpdateUserDto,
  ) {
    this.logger.debug(`Updating user ${id}`);
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN, RoleType.USER])
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.deleteUser(id);
  }
}
