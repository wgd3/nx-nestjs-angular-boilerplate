import { IsEmail, IsString } from 'class-validator';

import { IUserLogin } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto implements IUserLogin {
  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Password1!',
  })
  @IsString()
  password!: string;
}
