export interface RiskKRI {
  id: number;
  riskId: number;
  keyRiskIndicator: string;
  riskAppetite: string;
}

export interface RiskManagementInterface {
  id?: number;
  code?: string;
  riskEvent?: string;
  dimensionId?: number;
  dimensionName?: string;
  entityId?: number;
  entityName?: string;
  riskLevel?: number;
  processId?: number;
  processName?: string;
  riskCategoryId?: number;
  riskCategoryName?: string;
  rootCauseCategoryId?: number;
  rootCauseCategoryName?: string;
  rootCauseSubCategoryId?: number;
  rootCauseSubCategoryName?: string;
  riskDriver?: string;
  consequences?: string;
  status?: number;
  approvalStatus?: number;
  riskMitigationStatus?: number;
  comments?: string;
  riskOwnerId?: string;
  riskOwnerName?: string;
  highPriorityRisk?: boolean;
  strategicRisk?: boolean;
  validity?: string;
  mitigationPlanIds?: number[];
  controlIds?: number[];
  riskKRIs?: RiskKRI[];
  latestLikelihood?: number;
  latestImpact?: number;
  latestRiskScore?: number;
  latestRiskRating?: string;
}

export interface RiskAssessmentPayloadInterface {
  id: number;
  likelihoodScaleId: number;
  impactScaleId: number;
  assessmentDate: string;
  comments?: string;
}

export interface RiskAssessmentInterface {
  id: number;
  riskId: number;
  riskEvent: string;
  riskCode: string;
  likelihoodScaleId: number;
  likelihoodTitle: string;
  likelihoodValue: number;
  impactScaleId: number;
  impactTitle: string;
  impactValue: number;
  score: number;
  riskRatingId: number;
  ratingTitle: string;
  ratingColor: string;
  assessedBy: string;
  assessmentDate: string;
  comments: string;
}

export enum RiskStatusEnum {
  Open = 0,
  InProgress = 1,
  Closed = 2,
}

export enum RiskLevelEnum {
  ProcessGroup = 1,
  Process = 2,
  Activity = 3,
  Task = 4,
}

export enum RiskMitigationStatusEnum {
  Mitigated = 0,
  InProgress = 1,
  Unmitigated = 2,
}

export interface RiskFeedbackInterface {
  id: number;
  riskId: number;
  riskEvent: string;
  riskCode: string;
  status: number;
  feedback: string;
  reviewedById: number;
  reviewedByName: string;
  reviewedAt: string;
}

export enum RiskFeedbackStatusEnum {
  Approved = 1,
  Rejected = 2,
}

// export enum RiskStateEnum {
//   Active = 0,
//   Archived = 1,
// }
