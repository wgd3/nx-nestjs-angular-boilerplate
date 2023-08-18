import { Exclude, instanceToPlain } from 'class-transformer';
import { Column, Entity, VirtualColumn } from 'typeorm';

import { AbstractOrmEntity } from '@libs/server/util-common';
import {
  AuthProviderType,
  IUser,
  IUserEntity,
  RoleType,
} from '@libs/shared/util-types';

import { UserDto, UserDtoOptions } from '../../dtos';

@Entity({ name: 'users' })
// @UseDto(UserDto)
export class UserOrmEntity
  extends AbstractOrmEntity<UserDto, UserDtoOptions>
  implements IUserEntity
{
  @Column({ unique: true, type: String })
  email!: string;

  @Column({ nullable: true, type: String })
  @Exclude({ toPlainOnly: true })
  password!: string | null;

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

  @Column({ nullable: true, type: String })
  @Exclude({ toPlainOnly: true })
  refreshToken!: string | null;

  @Column({
    type: 'simple-enum',
    enum: AuthProviderType,
    nullable: false,
    default: AuthProviderType.EMAIL,
  })
  @Exclude({ toPlainOnly: true })
  socialProvider!: AuthProviderType;

  @Column({
    type: String,
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  socialId!: string | null;

  @Column({
    nullable: false,
    type: Boolean,
    default: false,
  })
  isEmailVerified!: boolean;

  @Column({
    type: String,
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  verificationHash!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @Exclude({ toPlainOnly: true })
  emailVerifiedOn!: Date | null;

  // TODO figure out how to make this type-safe!
  public override toJSON(): IUser {
    return instanceToPlain(this) as IUser;
  }
}
