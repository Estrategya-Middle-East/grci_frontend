

export interface FrequencyData {
  id: number;
  name: string;
}

export interface FrequencyResponse<T> {
  statusCode: number;
  meta: any; // can be null or object depending on API
  succeeded: boolean;
  message: string;
  errors: string[];
  data: T;
}
export interface RiskCategory {
  id: number;
  name: string;
  description: string;
  riskRatings: RiskRating[];
}


export interface RiskRating {
  id: number;
  riskRatingId: number;
  riskRatingTitle: string;
}