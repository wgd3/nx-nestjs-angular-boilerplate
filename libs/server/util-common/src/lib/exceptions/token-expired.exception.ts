import { UnauthorizedException } from '@nestjs/common';

export class TokenExpiredException extends UnauthorizedException {
  constructor(msg?: string) {
    super('Access token expired', msg);
  }
}
