import { SortOrderType } from '../../enums';

export interface IPaginationOptions {
  order: SortOrderType;
  page: number;
  take: number;
  skip: number;
}
