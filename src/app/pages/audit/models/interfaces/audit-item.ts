export interface AuditItemsResponse {
  statusCode: number;
  meta: any | null;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: AuditItemsData;
}

export interface AuditItemsData {
  items: AuditItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
export interface AuditItem {
  id: number;
  code: string;
  title: string;
  description: string;
  dimensionId: number;
  dimensionName: string | null;
  entityId: number;
  entityName: string;
  riskIds: number[];
  risks: any[]; // You can replace `any` with a Risk interface if needed
  priority: number;
  estimatedEffort: number;
  auditCategoryId: number;
  auditCategoryName: string;
  auditFrequencyId: number;
  auditFrequencyName: string;
  regulatoryFrameworks: string;
  auditOwnerId: string;
  auditOwnerName: string | null;
  status: number;
  state: number;
  comments: string;
  action?:boolean
}




export interface TableColumn {
  header: string;   // what the user sees
  field: keyof AuditItem | string; // which property to bind from the data
}


export interface FilterOption {
  label: string;
  value: string;
}

export interface AuditFilters {
  dimension: string | null;
  entity: string | null;
  auditCategory: string | null;
  status: string | null;
  priorityLevel: string | null;
  auditFrequency: string | null;
  auditOwner: string | null;
  searchText: string;
}
