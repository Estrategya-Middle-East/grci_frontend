export interface Risk {
  id: number;
  name: string;
}

export interface EvidenceAttachment {
  id: number;
  mitigationPlanId: number;
  title: string;
  fileType: number;
  fileUrl?: string;
  file?: File | null;
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
  riskIds: number[];
}

export interface MitigationPlanPayload {
  name: string;
  description: string;
  validityFrom: string;
  validityTo: string;
  status: number;
  riskIds: number[];
  mitigationPlanOwnerId: string;
  mitigationTypeId: number;
  mitigationCategoryId: number;
  mitigationAutomationId: number;
  mitigationNatureId: number;
  evidenceAttachments: EvidenceAttachment[];
}
