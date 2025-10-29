export interface RiskItem {
  id: number;
  name: string;
}

export interface RiskData {
  items: RiskItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface RiskResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: RiskData;
}
