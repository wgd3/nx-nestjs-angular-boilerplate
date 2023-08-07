import { RoleType } from '../enums';
import { IBaseEntity } from './base-entity.interface';

export interface IUser extends IBaseEntity {
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: RoleType;
}

/**
 * Allows for strong typing of user instances when returned from the API. Date objects
 * can not be sent over the network (serialized to strings), and we want to exclude certain
 * properties from the response.
 */
export type ISerializedUser = Omit<
  IUser,
  'createdAt' | 'updatedAt' | 'password'
> & {
  createdAt: string;
  updatedAt: string;
};

/**
 * `id`, `createdAt`, and `updatedAt` are all auto-populated. All other fields are 
 * "required" - but the names and avatar can accept `null`. 
 */
export type ICreateUser = Omit<IUser, keyof IBaseEntity>;

export type IUpdateUser = Partial<ICreateUser>;