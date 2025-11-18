import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import {
  AuditPlanMemorandumInterface,
  AuditPlanMemorandumListInterface,
} from "../models/audit-plan-memorandum";
import { lookup } from "../../../shared/models/lookup.mdoel";

@Injectable({
  providedIn: "root",
})
export class AuditPlanMemorandumServie {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/AuditPlanMemorandums";

  getList(
    filter: any = {}
  ): Observable<PagedResult<AuditPlanMemorandumListInterface>> {
    let params = new HttpParams();

    if (filter.pageNumber !== undefined)
      params = params.set("PageNumber", filter.pageNumber);
    if (filter.pageSize !== undefined)
      params = params.set("PageSize", filter.pageSize);

    // Handle dynamic filters
    if (filter.filterField && filter.filterValue) {
      filter.filterField.forEach((field: string, i: number) => {
        const value = filter.filterValue[i];
        if (value !== undefined && field) {
          params = params.set(field, value);
        }
      });
    }

    return this.http
      .get<ApiResponse<PagedResult<AuditPlanMemorandumListInterface>>>(
        `${this.baseUrl}`,
        {
          params,
        }
      )
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<AuditPlanMemorandumInterface> {
    return this.http
      .get<ApiResponse<AuditPlanMemorandumInterface>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(
    resourcePerformance: Omit<AuditPlanMemorandumInterface, "id">
  ): Observable<AuditPlanMemorandumInterface> {
    return this.http
      .post<ApiResponse<AuditPlanMemorandumInterface>>(
        this.baseUrl,
        resourcePerformance
      )
      .pipe(map((res) => res.data));
  }

  update(
    id: number,
    resourcePerformance: Partial<AuditPlanMemorandumInterface>
  ): Observable<AuditPlanMemorandumInterface> {
    return this.http
      .put<ApiResponse<AuditPlanMemorandumInterface>>(
        `${this.baseUrl}/${id}`,
        resourcePerformance
      )
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  archive(id: number): Observable<any> {
    return this.http
      .patch<ApiResponse<any>>(`${this.baseUrl}/${id}/archive`, {})
      .pipe(map((res) => res.data));
  }

  getAuditCategoriesLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/AuditCategories/lookup`)
      .pipe(map((res) => res.data.items));
  }
}
