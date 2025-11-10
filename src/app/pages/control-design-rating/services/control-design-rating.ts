import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { lookup } from "../../../shared/models/lookup.mdoel";
import { ControlRiskRating } from "../models/control-design-rating";

@Injectable({
  providedIn: "root",
})
export class ControlDesignRatingService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/ControlDesignRatings";

  getList(filter: any = {}): Observable<PagedResult<ControlRiskRating>> {
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
      .get<ApiResponse<PagedResult<ControlRiskRating>>>(`${this.baseUrl}`, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<ControlRiskRating> {
    return this.http
      .get<ApiResponse<ControlRiskRating>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(
    resourcePerformance: Omit<ControlRiskRating, "id">
  ): Observable<ControlRiskRating> {
    return this.http
      .post<ApiResponse<ControlRiskRating>>(this.baseUrl, resourcePerformance)
      .pipe(map((res) => res.data));
  }

  update(
    id: number,
    resourcePerformance: Partial<ControlRiskRating>
  ): Observable<ControlRiskRating> {
    return this.http
      .put<ApiResponse<ControlRiskRating>>(
        `${this.baseUrl}/${id}`,
        resourcePerformance
      )
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  archive(id: number) {
    return this.http
      .patch<ApiResponse<any>>(`${this.baseUrl}/${id}/archive`, {})
      .pipe(map((res) => res.data));
  }

  getControlsLookup(): Observable<lookup[]> {
    return this.http
      .get(`${environment.baseUrl}api/Controls/lookup`)
      .pipe(map((res: any) => res.data));
  }

  getRisksLookup(): Observable<lookup[]> {
    return this.http
      .get(`${environment.baseUrl}api/Risks/Lookup`)
      .pipe(map((res: any) => res.data.items));
  }
}
