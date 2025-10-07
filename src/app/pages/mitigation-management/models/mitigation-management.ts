export interface Risk {
  id: number;
  name: string;
}

export interface EvidenceAttachment {
  id: number;
  mitigationPlanId: number;
  fileName: string;
  fileType: number;
}

export interface MitigationType {
  id: number;
  name: string;
}

export interface MitigationCategory {
  id: number;
  name: string;
}

export interface MitigationAutomation {
  id: number;
  name: string;
}

export interface MitigationNature {
  id: number;
  name: string;
}

export interface MitigationPlan {
  id: number;
  name: string;
  description: string;
  validityFrom: string;
  validityTo: string;
  status: number;
  risks: Risk[];
  mitigationPlanOwnerId: string;
  evidenceAttachments: EvidenceAttachment[];
  mitigationTypeId: number;
  mitigationType: MitigationType;
  mitigationCategoryId: number;
  mitigationCategory: MitigationCategory;
  mitigationAutomationId: number;
  mitigationAutomation: MitigationAutomation;
  mitigationNatureId: number;
  mitigationNature: MitigationNature;
}
