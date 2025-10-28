export interface AddauditItemResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: AddauditItem;
}

export interface AddauditItem {
  id: number;
  code: string;
  title: string;
  description: string;
  dimensionId: number;
  dimensionName: string;
  entityId: number;
  entityName: string;
  riskIds: number[];
  risks: Risk[];
  priority: number;
  estimatedEffort: number;
  auditCategoryId: number;
  auditCategoryName: string;
  auditFrequencyId: number;
  auditFrequencyName: string;
  regulatoryFrameworks: string;
  auditOwnerId: string;
  auditOwnerName: string;
  status: number;
  state: number;
  comments: string;
}

export interface Risk {
  riskId: number;
  riskCode: string;
  riskEvent: string;
  riskCategory: string;
  riskRating: string;
}
