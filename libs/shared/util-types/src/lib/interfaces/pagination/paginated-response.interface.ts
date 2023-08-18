import { IPaginationMeta } from './pagination-meta.interface';

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}
