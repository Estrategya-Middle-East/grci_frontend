export interface AuditPlanFeedbackInterface {
  id: number;
  auditPlanId: number;
  auditPlanCode: string;
  auditPlanTitle: string;
  status: number;
  statusName: string;
  feedback: string;
  reviewedById: number;
  reviewedByName: string;
  reviewedAt: string;
}

export interface AuditPlanFeedbackPayloadInterface {
  auditPlanId: number;
  feedback: string;
  status: number;
}
