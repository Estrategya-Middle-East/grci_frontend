export interface EngagementResponse {
  statusCode: number;
  meta: MetaData;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: EngagementData;
}

export interface MetaData {
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface EngagementData {
  items: EngagementItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface EngagementItem {
  id: number;
  description: string;
}
