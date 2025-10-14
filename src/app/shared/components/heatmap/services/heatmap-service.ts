import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse } from "../../../models/api.mode";
import { HeatmapInterface, HeatmapWithRiskInterface } from "../models/heatmap";

@Injectable({
  providedIn: "root",
})
export class HeatmapService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/RiskScoring/heatmap";

  getHeatmap(): Observable<HeatmapInterface> {
    return this.http
      .get<ApiResponse<HeatmapInterface>>(`${this.baseUrl}`)
      .pipe(map((res) => res.data));
  }

  getHeatmapWithRisks(): Observable<HeatmapWithRiskInterface> {
    return this.http
      .get<ApiResponse<HeatmapWithRiskInterface>>(`${this.baseUrl}/risks`)
      .pipe(map((res) => res.data));
  }
}
