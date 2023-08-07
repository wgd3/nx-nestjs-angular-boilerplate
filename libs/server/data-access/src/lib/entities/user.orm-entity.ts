import { BaseOrmEntity, UseDto } from '@libs/server/util-common';
import { IUser, RoleType } from '@libs/shared/util-types';
import { Column, Entity, VirtualColumn } from 'typeorm';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { Exclude } from 'class-transformer';


@Entity({name: 'users'})
@UseDto(CreateUserDto)
export class UserOrmEntity extends BaseOrmEntity<any, any> implements IUser {
  
  @Column()
  email!: string;

  @Column()
  @Exclude({toPlainOnly: true})
  password!: string;

  @Column({ nullable: true })
  firstName!: string | null;

  @Column({ nullable: true })
  lastName!: string | null;

  @Column({ nullable: true })
  avatar!: string | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @Column({
    type: 'simple-enum',
    enum: RoleType,
    default: RoleType.USER
  })
  role!: RoleType;
}
