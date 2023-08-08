import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(msg?: string) {
    super('User not found', msg);
  }
}
