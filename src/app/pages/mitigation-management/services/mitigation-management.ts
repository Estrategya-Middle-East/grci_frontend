import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { MitigationPlan } from "../models/mitigation-management";

@Injectable({
  providedIn: "root",
})
export class MitigationManagementService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/MitigationPlans";

  getMitigationPlans(
    filter: any = {}
  ): Observable<PagedResult<MitigationPlan>> {
    let params = new HttpParams();

    if (filter.pageNumber !== undefined)
      params = params.set("PageNumber", filter.pageNumber);
    if (filter.pageSize !== undefined)
      params = params.set("PageSize", filter.pageSize);

    if (filter.filterField && filter.filterValue) {
      filter.filterField.forEach((field: string, i: number) => {
        const value = filter.filterValue[i];
        if (value !== undefined && field) {
          params = params.set(field, value);
        }
      });
    }

    return this.http
      .get<ApiResponse<PagedResult<MitigationPlan>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getMitigationPlanById(id: number): Observable<MitigationPlan> {
    return this.http
      .get<ApiResponse<MitigationPlan>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createMitigationPlan(
    plan: Omit<MitigationPlan, "id">
  ): Observable<MitigationPlan> {
    return this.http
      .post<ApiResponse<MitigationPlan>>(this.baseUrl, plan)
      .pipe(map((res) => res.data));
  }

  updateMitigationPlan(
    id: number,
    plan: Partial<MitigationPlan>
  ): Observable<MitigationPlan> {
    return this.http
      .put<ApiResponse<MitigationPlan>>(`${this.baseUrl}/${id}`, plan)
      .pipe(map((res) => res.data));
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }

  deleteMitigationPlan(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }
}
