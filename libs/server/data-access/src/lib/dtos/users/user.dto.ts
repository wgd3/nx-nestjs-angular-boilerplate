import { AbstractDto, AbstractDtoOptions } from '@libs/server/util-common';
import { RoleType } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

import { UserOrmEntity } from '../../database/entities/user.orm-entity';

export type UserDtoOptions = AbstractDtoOptions;

/**
 * UserDto represents data from the User entity _before_ serializing into JSON
 * for an API response. To serialize a User entity, use the User.toJSON() method
 */
export class UserDto extends AbstractDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string | null;

  @ApiProperty()
  lastName!: string | null;

  @ApiProperty()
  avatar!: string | null;

  @ApiProperty({ enum: RoleType })
  role!: RoleType;

  constructor(user: UserOrmEntity, opts?: UserDtoOptions) {
    super(user, opts);
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;
    this.role = user.role;
  }
}
