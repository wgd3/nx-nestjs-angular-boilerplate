import { ITokenResponse } from '@libs/shared/util-types';
import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto implements ITokenResponse {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  constructor(data: { accessToken: string; refreshToken: string }) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}
