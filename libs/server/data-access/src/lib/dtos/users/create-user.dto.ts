import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_NUMBER,
  PASSWORD_MIN_SYMBOL,
  PASSWORD_MIN_UPPERCASE,
} from '@libs/shared/util-constants';
import {
  AuthProviderType,
  ICreateUser,
  RoleType,
} from '@libs/shared/util-types';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateUserDto implements ICreateUser {
  @ApiProperty({
    type: String,
    example: 'wallace@thefullstack.engineer',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: String,
    description: `Password must contain: ${PASSWORD_MIN_LENGTH} characters, ${PASSWORD_MIN_NUMBER} number(s), ${PASSWORD_MIN_UPPERCASE} uppercase letter(s), and ${PASSWORD_MIN_SYMBOL} symbol(s)`,
    example: 'Password1!',
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
  @ValidateIf((o) => o.socialProvider === null)
  password!: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  firstName!: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  lastName!: string | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  avatar!: string | null;

  @ApiHideProperty()
  role: RoleType = RoleType.USER;

  @ApiProperty({
    enum: AuthProviderType,
    default: AuthProviderType.EMAIL,
  })
  @IsEnum(AuthProviderType)
  socialProvider!: AuthProviderType;

  @ApiHideProperty()
  @IsOptional()
  socialId!: string | null;
}
