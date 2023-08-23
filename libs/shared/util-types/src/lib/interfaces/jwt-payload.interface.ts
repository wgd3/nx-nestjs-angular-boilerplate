import { RoleType } from '../enums';

export interface IJwtPayload {
  /**
   * User UUID
   */
  sub: string;

  email: string;

  role: RoleType;

  iat: string;

  exp: number;
}
