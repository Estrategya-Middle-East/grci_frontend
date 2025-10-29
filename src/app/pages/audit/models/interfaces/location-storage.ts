// storage-location.model.ts

export interface Meta {
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface StorageLocationItem {
  id: number;
  name: string;
  path: string;
  notes: string;
  default: boolean;
}

export interface StorageLocationData {
  items: StorageLocationItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface StorageLocationResponse {
  statusCode: number;
  meta: Meta;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: StorageLocationData;
}
