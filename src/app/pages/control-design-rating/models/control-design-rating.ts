export interface ControlRiskRating {
  id: number;
  controlRiskId: number;
  controlId: number;
  controlName: string;
  riskId: number;
  riskEvent: string;
  sensitivity: number;
  sensitivityWeight: number;
  reliability: number;
  reliabilityWeight: number;
  verifiability: number;
  verifiabilityWeight: number;
  override: number;
  overrideWeight: number;
  correction: number;
  correctionWeight: number;
  competence: number;
  competenceWeight: number;
  rating: number;
  remarks: string;
  ratingDate: string; // ISO string, can convert to Date if needed
  totalWeight: number;
  createdBy: string;
  createdDate: string; // ISO string
  updatedBy: string;
  updatedDate: string; // ISO string
  isArchived: boolean;
}
