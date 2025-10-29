export interface EntitiesResponse {
  statusCode: number;
  meta: any | null;
  succeeded: boolean;
  message: string;
  errors: any[];
  data: EntitiesItem[];
}

export interface EntitiesItem {
  id: number;
  name: string;
}
