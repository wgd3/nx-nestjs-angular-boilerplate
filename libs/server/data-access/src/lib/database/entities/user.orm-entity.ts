import { Exclude } from 'class-transformer';
import { Column, Entity, VirtualColumn } from 'typeorm';

import { BaseOrmEntity, UseDto } from '@libs/server/util-common';
import { IUser, RoleType } from '@libs/shared/util-types';

import { CreateUserDto } from '../../dtos/users/create-user.dto';

@Entity({ name: 'users' })
@UseDto(CreateUserDto)
export class UserOrmEntity extends BaseOrmEntity<any, any> implements IUser {
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
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @Column({
    type: 'simple-enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role!: RoleType;
}
