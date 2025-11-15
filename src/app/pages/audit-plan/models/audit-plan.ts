export interface AuditPlanInterface {
  id: number;
  code: string;
  auditCycleId: number;
  auditCycleCode: string;
  auditCycleTitle: string;
  engagementId: number;
  engagementDescription: string;
  year: number;
  status: number;
  statusName: string;
  title: string;
  remarks: string;
  auditObjectives: string;
  auditScope: string;
  strategicFramework: string;
  auditItemIds: number[];
  auditItems: AuditItem[];
  totalAuditItems: number;
}

export interface AuditItem {
  id: number;
  auditPlanId: number;
  auditItemId: number;
  auditItemCode: string;
  auditItemTitle: string;
  auditItemDescription: string;
  priority: string;
  status: string;
  entityName: string;
  dimensionName: string;
  estimatedEffort: number;
  auditCategoryName: string;
  auditFrequency: string;
  scope: string;
  objective: string;
  auditApproach: string;
  keyFocusAreas: string[];
  allocatedResources: number;
  managementFocusPoints: string;
}
