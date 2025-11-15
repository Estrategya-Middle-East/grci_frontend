export interface ControlEffectivnessAssessmentInterface {
  id: number;
  controlRiskId: number;
  controlName: string;
  riskEvent: string;
  riskCode: string;
  effectivenessPercentage: number;
  controlsEffectivenessId: number;
  effectivenessLevelName: string;
  assessmentDate: string;
  comments: string;
  assessedById: string;
  assessedByName: string;
}
