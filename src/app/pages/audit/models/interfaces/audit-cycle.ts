export interface AuditCycle {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  objectives?: string;
  scope?: string;
  strategicFramework?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditCycleParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
