export interface HeatmapInterface {
  impactColumns: HeatmapLevel[];
  likelihoodRows: HeatmapLevel[];
  cells: HeatmapCell[];
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

export interface HeatmapLevel {
  id: number;
  title: string;
  value: number;
  position: number;
}
