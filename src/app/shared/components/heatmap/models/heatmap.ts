export interface HeatmapInterface {
  impactColumns: HeatmapLevel[];
  likelihoodRows: HeatmapLevel[];
  cells: HeatmapCell[];
}

export interface HeatmapWithRiskInterface extends HeatmapInterface {
  riskRatingTotals: Record<string, number>;
  risks: HeatmapFullRisk[];
}

export interface HeatmapLevel {
  id: number;
  title: string;
  value: number;
  position: number;
}

export interface HeatmapCell {
  impactId: number;
  likelihoodId: number;
  score: number;
  color: string;
  riskRatingTitle: string;
  risks: HeatmapRisk[];
}

export interface HeatmapRisk {
  riskId: number;
  riskCode: string;
  riskEvent: string;
  score: number;
}

export interface HeatmapFullRisk {
  id: number;
  code: string;
  dimensionId: number;
  dimensionName: string;
  entityId: number;
  entityName: string;
  riskLevel: number;
  riskCategoryId: number;
  riskCategoryName: string;
  impactId: number;
  impactTitle: string;
  likelihoodId: number;
  likelihoodTitle: string;
  score: number;
  riskRatingId: number;
  riskRatingTitle: string;
  riskDriver: string;
  riskEvent: string;
  consequences: string;
  riskMitigationStatus: number;
  riskOwner: string;
  status: number;
  highPriorityRisk: boolean;
  strategicRisk: boolean;
}
