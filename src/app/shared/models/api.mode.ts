export interface ApiResponse<T> {
  statusCode: number;
  meta: any | null;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: T;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
