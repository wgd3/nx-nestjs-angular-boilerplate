import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_NUMBER,
  PASSWORD_MIN_SYMBOL,
  PASSWORD_MIN_UPPERCASE,
} from '@libs/shared/util-constants';
import { IResetPasswordPayload } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto implements IResetPasswordPayload {
  @ApiProperty({
    type: String,
    example: 'wallace@thefullstack.engineer',
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: String,
    description: `Password must contain: ${PASSWORD_MIN_LENGTH} characters, ${PASSWORD_MIN_NUMBER} number(s), ${PASSWORD_MIN_UPPERCASE} uppercase letter(s), and ${PASSWORD_MIN_SYMBOL} symbol(s)`,
    example: 'Password1!',
    required: true,
  })
  @IsStrongPassword(
    {
      minLength: PASSWORD_MIN_LENGTH,
      minNumbers: PASSWORD_MIN_NUMBER,
      minUppercase: PASSWORD_MIN_UPPERCASE,
      minSymbols: PASSWORD_MIN_SYMBOL,
    },
    {
      message: `Password is not strong enough. Must contain: 8 characters, 1 number, 1 uppercase letter, 1 symbol`,
    },
  )
  @MaxLength(PASSWORD_MAX_LENGTH)
  password!: string;
}
