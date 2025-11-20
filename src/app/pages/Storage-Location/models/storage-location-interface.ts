export interface storageLocationApiResponse<T> {
  statusCode: number;
  meta: {
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
  succeeded: boolean;
  message: string;
  errors: any[];
  data: PaginatedData<T>;
}

export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Item {
  id: number;
  name: string;
  path: string;
  notes: string;
  default: boolean;
}
