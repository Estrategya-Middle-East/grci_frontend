export interface ApiResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: FeedbackData;
}

export interface FeedbackData {
  items: FeedbackItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FeedbackItem {
  id: number;
  auditItemId: number;
  auditItemCode: string;
  auditItemTitle: string;
  status: number;
  feedback: string;
  reviewedById: number;
  reviewedByName: string;
  reviewedAt: string; // ISO date string
}
