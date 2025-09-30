export interface ImpactInterface {
  id: number;
  title: string;
  value: number;
  code: number;
}

export interface LikelihoodInterface {
  id: number;
  title: string;
  value: number;
  code: number;
}

export interface RiskRatingInterface {
  code: number;
  id: number;
  title: string;
  color: string;
  scoreMin: number;
  scoreMax: number;
}
