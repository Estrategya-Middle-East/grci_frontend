import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { AuditItem, AuditPlanInterface } from "../models/audit-plan";
import { lookup } from "../../../shared/models/lookup.mdoel";

@Injectable({
  providedIn: "root",
})
export class AuditPlanService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/AuditPlans";

  getList(filter: any = {}): Observable<PagedResult<AuditPlanInterface>> {
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
      .get<ApiResponse<PagedResult<AuditPlanInterface>>>(`${this.baseUrl}`, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<AuditPlanInterface> {
    return this.http
      .get<ApiResponse<AuditPlanInterface>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(
    resourcePerformance: Omit<AuditPlanInterface, "id">
  ): Observable<AuditPlanInterface> {
    return this.http
      .post<ApiResponse<AuditPlanInterface>>(this.baseUrl, resourcePerformance)
      .pipe(map((res) => res.data));
  }

  update(
    id: number,
    resourcePerformance: Partial<AuditPlanInterface>
  ): Observable<AuditPlanInterface> {
    return this.http
      .put<ApiResponse<AuditPlanInterface>>(
        `${this.baseUrl}/${id}`,
        resourcePerformance
      )
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  getDimensionsLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Dimensions/lookup`)
      .pipe(map((res) => res.data));
  }

  getEntitiesLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Entities/lookup`)
      .pipe(map((res) => res.data));
  }

  getAuditEngagementsLookUp(): Observable<
    { id: number; description: string }[]
  > {
    return this.http
      .get<any>(`${environment.baseUrl}api/AuditEngagements/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getAuditItemsLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/AuditItems/lookup`)
      .pipe(map((res) => res.data));
  }

  getAuditItemsList(
    auditPlanId: number,
    filter: any = {}
  ): Observable<PagedResult<AuditItem>> {
    let params = new HttpParams().set("auditPlanId", auditPlanId);

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
      .get<ApiResponse<PagedResult<AuditItem>>>(
        `${environment.baseUrl}api/AuditItems/summary`,
        {
          params,
        }
      )
      .pipe(map((res) => res.data));
  }
}
