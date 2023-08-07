import { IsEmail, IsOptional, IsStrongPassword, MaxLength } from 'class-validator';

import { BaseDto } from '@libs/server/util-common';
import {
    PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MIN_NUMBER, PASSWORD_MIN_SYMBOL,
    PASSWORD_MIN_UPPERCASE
} from '@libs/shared/util-constants';
import { ICreateUser, RoleType } from '@libs/shared/util-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';



export class CreateUserDto extends BaseDto implements ICreateUser {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsStrongPassword(
    {
      minLength: PASSWORD_MIN_LENGTH,
      minNumbers: PASSWORD_MIN_NUMBER,
      minUppercase: PASSWORD_MIN_UPPERCASE,
      minSymbols: PASSWORD_MIN_SYMBOL,
    },
    {
      message: `Password is not strong enough. Must contain: 8 characters, 1 number, 1 uppercase letter, 1 symbol`,
    }
  )
  @MaxLength(PASSWORD_MAX_LENGTH)
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  firstName!: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  lastName!: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  avatar!: string | null;

  @ApiPropertyOptional({ enum: RoleType })
  role!: RoleType;
}
