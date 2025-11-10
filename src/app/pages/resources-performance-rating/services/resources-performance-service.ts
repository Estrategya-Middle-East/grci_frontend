import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { lookup } from "../../../shared/models/lookup.mdoel";
import { ResourcePerformanceInterface } from "../models/resources-performance-rating";

@Injectable({
  providedIn: "root",
})
export class ResourcesPerformanceService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/ResourcePerformanceRatings";

  getList(
    filter: any = {}
  ): Observable<PagedResult<ResourcePerformanceInterface>> {
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
      .get<ApiResponse<PagedResult<ResourcePerformanceInterface>>>(
        `${this.baseUrl}/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<ResourcePerformanceInterface> {
    return this.http
      .get<ApiResponse<ResourcePerformanceInterface>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(
    resourcePerformance: Omit<ResourcePerformanceInterface, "id">
  ): Observable<ResourcePerformanceInterface> {
    return this.http
      .post<ApiResponse<ResourcePerformanceInterface>>(
        this.baseUrl,
        resourcePerformance
      )
      .pipe(map((res) => res.data));
  }

  update(
    id: number,
    resourcePerformance: Partial<ResourcePerformanceInterface>
  ): Observable<ResourcePerformanceInterface> {
    return this.http
      .put<ApiResponse<ResourcePerformanceInterface>>(
        `${this.baseUrl}/${id}`,
        resourcePerformance
      )
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  getResourcesLookup(): Observable<lookup[]> {
    return this.http
      .get(`${environment.baseUrl}api/ResourceManagements/lookup`)
      .pipe(map((res: any) => res.data));
  }

  getCompetancyLookup(): Observable<lookup[]> {
    return this.http
      .get(`${environment.baseUrl}api/CompetencyFrameworks/lookup`)
      .pipe(map((res: any) => res.data));
  }
}
