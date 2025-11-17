export interface AuditItemScheduleResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: AuditItemScheduleData;
}

export interface AuditItemScheduleData {
  items: AuditItemScheduleItem[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AuditItemScheduleItem {
  id: number;
  title: string;
  auditItemId: number;
  auditItemCode: string;
  auditItemTitle: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  keyActivities: KeyActivity[];
  resources: number[];
  resourceDetails: ResourceDetail[];
  action?: boolean;
}
export interface AuditItemScheduleTableRow {
  auditItemId: number;
  title: string;
  auditItemTitle: string;
  startDate: string;
  endDate: string;
  activityName: string;
  description: string;
  action: boolean;
}

export interface KeyActivity {
  id: number;
  auditScheduleId: number;
  activityName: string;
  description: string;
}

export interface ResourceDetail {
  userId: number;
  userName: string;
  email: string;
}
