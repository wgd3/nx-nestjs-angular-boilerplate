import { Exclude } from 'class-transformer';
import { Column, Entity, VirtualColumn } from 'typeorm';

import { BaseOrmEntity } from '@libs/server/util-common';
import { IUser, RoleType } from '@libs/shared/util-types';

import { UserDto } from '../../dtos';

@Entity({ name: 'users' })
// @UseDto(UserDto)
export class UserOrmEntity
  extends BaseOrmEntity<UserDto, object>
  implements IUser
{
  @Column({ unique: true, type: String })
  email!: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password!: string;

  @Column({ nullable: true, type: String })
  firstName!: string | null;

  @Column({ nullable: true, type: String })
  lastName!: string | null;

  @Column({ nullable: true, type: String })
  avatar!: string | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}."firstName", ' ', ${alias}."lastName")`,
  })
  fullName!: string;

  @Column({
    type: 'simple-enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role!: RoleType;
}
