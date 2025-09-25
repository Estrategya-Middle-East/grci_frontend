import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { Strategy } from "../models/strategy";

@Injectable({
  providedIn: "root",
})
export class OrganizationStrategy {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/OrganizationStrategy";

  getStrategies(filter: any = {}): Observable<PagedResult<Strategy>> {
    let params = new HttpParams();

    if (filter.pageNumber !== undefined)
      params = params.set("PageNumber", filter.pageNumber);
    if (filter.pageSize !== undefined)
      params = params.set("PageSize", filter.pageSize);

    // Convert filterField & filterValue arrays to named query params
    if (filter.filterField && filter.filterValue) {
      filter.filterField.forEach((field: string, i: number) => {
        const value = filter.filterValue[i];
        if (value !== undefined && field) {
          params = params.set(field, value);
        }
      });
    }

    return this.http
      .get<ApiResponse<PagedResult<Strategy>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getStrategyById(id: number): Observable<Strategy> {
    return this.http
      .get<ApiResponse<Strategy>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createStrategy(strategy: Omit<Strategy, "id">): Observable<Strategy> {
    return this.http
      .post<ApiResponse<Strategy>>(this.baseUrl, strategy)
      .pipe(map((res) => res.data));
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }

  updateStrategy(
    id: number,
    strategy: Partial<Strategy>
  ): Observable<Strategy> {
    return this.http
      .put<ApiResponse<Strategy>>(`${this.baseUrl}/${id}`, strategy)
      .pipe(map((res) => res.data));
  }

  deleteStrategy(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }
}
