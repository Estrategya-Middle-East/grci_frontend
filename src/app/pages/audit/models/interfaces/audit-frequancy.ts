export interface RiskRating {
  id: number;
  riskRatingId: number;
  riskRatingTitle: string;
}


export interface FrequencyData {
 id: number;
  name: string;
}

export interface FrequencyResponse {
  statusCode: number;
  meta: any; // can be null or object depending on API
  succeeded: boolean;
  message: string;
  errors: string[];
  data: FrequencyData[];
}
