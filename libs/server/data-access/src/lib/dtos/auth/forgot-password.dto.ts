import { IsEmail } from 'class-validator';

import { IForgotPasswordPayload } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto implements IForgotPasswordPayload {
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'foo@bar.com',
  })
  email!: string;
}
