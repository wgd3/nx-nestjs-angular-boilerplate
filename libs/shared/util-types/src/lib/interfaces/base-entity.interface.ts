import { Uuid } from '../types';

export interface IBaseEntity {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
