
export interface AuditCategories<T> {
  statusCode: number;
  meta: Meta;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: T;
}

export interface Meta {
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
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

export interface AuditCategory {
  description: string;
  storageLocationId: number | null;
  id: number;
  name: string;
  action?:Boolean
}
