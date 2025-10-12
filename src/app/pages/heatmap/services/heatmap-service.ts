import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../../../shared/models/api.mode";
import { HeatmapInterface } from "../models/heatmap";

@Injectable({
  providedIn: "root",
})
export class HeatmapService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/RiskScoring";

  getHeatmap(): Observable<HeatmapInterface> {
    return this.http
      .get<ApiResponse<HeatmapInterface>>(`${this.baseUrl}/heatmap`)
      .pipe(map((res) => res.data));
  }
}
