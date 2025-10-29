export interface DimensionsResponse {
  data: {
    items: Dimension[];
    totalPages: number;
    totalItems: number;
    pageSize: number;
    pageNumber: number;
  };
}

export interface Dimension {
  id: number;
  code: string;
  title: string;
  description: string;
  entityCount: number;
}

export interface DimensionsFilter {
  pageNumber?: number;
  pageSize?: number;
  filterValue?: string;
  filterField?: string;
  totalItems?: number;
  totalPages?: number;
}
export interface DimensionsLookupsResponse<T> {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: T[];
}

export interface Item {
  id: number;
  name: string;
}