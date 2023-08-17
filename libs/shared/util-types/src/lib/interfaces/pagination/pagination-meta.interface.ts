export interface IPaginationMeta {
  page: number;
  take: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: string | null;
  previousPage: string | null;
}
