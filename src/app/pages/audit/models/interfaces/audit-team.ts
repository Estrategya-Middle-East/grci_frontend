export interface AuditTeamResponse {
  statusCode: number;
  meta: Meta;
  succeeded: boolean;
  message: string;
  errors: string[];
  data: AuditData;
}

export interface Meta {
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface AuditData {
  items: AuditItemTeam[];
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AuditItemTeam {
  id: number;
  auditItemId: number;
  auditItemName: string;
  auditPlanId: number;
  auditRole: string;
  contributionPercent: number;
  totalHours: number;
  contributionResource: number;
  skills: Skill[] | string;
  allSkills?: any[];
}

export interface Skill {
  resourceSkillId: number;
  resourceSkillName: string;
}
