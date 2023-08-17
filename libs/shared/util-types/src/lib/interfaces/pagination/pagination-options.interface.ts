import { SortOrderType } from '../../enums';

export interface IPaginationOptions {
  order?: SortOrderType;
  page?: number;
  perPage?: number;
  skip?: number;
}
