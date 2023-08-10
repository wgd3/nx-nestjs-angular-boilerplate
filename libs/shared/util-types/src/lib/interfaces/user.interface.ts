import { RoleType, SocialAuthProviderType } from '../enums';
import { IBaseEntity } from './base-entity.interface';

export interface IUserEntity extends IBaseEntity {
  email: string;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: RoleType;
  refreshToken: string | null;
  socialProvider: SocialAuthProviderType | null;

  /**
   * Provider-specified user ID
   */
  socialId: string | null;
}

/**
 * Allows for strong typing of user instances when returned from the API. Date objects
 * can not be sent over the network (serialized to strings), and we want to exclude certain
 * properties from the response.
 */
export type IUser = Omit<
  IUserEntity,
  | 'createdAt'
  | 'updatedAt'
  | 'password'
  | 'refreshToken'
  | 'socialProvider'
  | 'socialId'
> & {
  createdAt: string;
  updatedAt: string;
};

/**
 * `id`, `createdAt`, and `updatedAt` are all auto-populated. All other fields are
 * "required" - but the names and avatar can accept `null`.
 */
export type ICreateUser = Omit<IUserEntity, keyof IBaseEntity | 'refreshToken'>;

export type IUpdateUser = Partial<ICreateUser>;
