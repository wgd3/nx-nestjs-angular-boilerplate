export interface IPaginationMeta {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: string | null;
  previousPage: string | null;
}
