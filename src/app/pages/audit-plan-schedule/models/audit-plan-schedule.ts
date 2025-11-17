export interface AuditPlanScheduleInterface {
  id: number;
  title: string;

  auditPlanId: number;
  auditPlanCode: string;
  auditPlanTitle: string;

  startDate: string;
  endDate: string;

  keyActivities: KeyActivityInterface[];
  resources: number[];
  resourceDetails: ResourceDetailInterface[];
}

export interface KeyActivityInterface {
  id: number;
  auditPlanScheduleId: number;
  activityName: string;
  description: string;
}

export interface ResourceDetailInterface {
  userId: number;
  userName: string;
  email: string;
}
