export interface AuditPlanMemorandumInterface {
  auditPlanId: number;
  auditItemId: number;
  background: string;
  auditObjectives: string;
  auditScope: string;
  excludedFromScope: string;
  announcementLetterSentMilestone: string;
  completionOfPlanningMilestone: string;
  fieldworkMilestone: string;
  reportMilestone: string;
  reporting: string;
  riskAnalyses: RiskAnalysis[];
}

export interface RiskAnalysis {
  auditCategoryId: number;
  noOfHours: number;
  justification: string;
}

export interface AuditPlanMemorandumListInterface {
  id: number;
  memorandumCode: string;
  auditPlanCode: string;
  engagementName: string;
  auditScope: string;
  auditItemName: string;
  objectives: string;
  auditApproach: string;
  keyRisksAddressed: string;
  approvalRemarks: string | null;
  approvalDate: string | null;
  status: number;
  statusName: string;
}
