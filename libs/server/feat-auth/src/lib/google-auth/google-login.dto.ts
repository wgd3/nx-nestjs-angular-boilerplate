import { IsString } from 'class-validator';

import { IGoogleLoginPayload } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthLoginDto implements IGoogleLoginPayload {
  @ApiProperty()
  @IsString()
  idToken!: string;
}
