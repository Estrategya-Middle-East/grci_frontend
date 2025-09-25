import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { DimensionsResponse, Dimension, DimensionsFilter } from "../models";

@Injectable({
  providedIn: "root",
})
export class DimensionsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/Dimensions";

  getDimensions(filter: DimensionsFilter = {}): Observable<DimensionsResponse> {
    let params = new HttpParams();

    if (filter.pageNumber !== undefined) {
      params = params.set("PageNumber", filter.pageNumber);
    }

    if (filter.pageSize !== undefined) {
      params = params.set("PageSize", filter.pageSize);
    }

    if (filter.filterValue) {
      params = params.set("FilterValue", filter.filterValue);
    }

    if (filter.filterField) {
      params = params.set("FilterField", filter.filterField);
    }

    return this.http.get<DimensionsResponse>(`${this.baseUrl}`, {
      params,
    });
  }

  getDimensionById(id: number): Observable<Dimension> {
    return this.http
      .get<any>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createDimension(dimension: Omit<Dimension, "id">): Observable<Dimension> {
    return this.http
      .post<any>(`${this.baseUrl}`, dimension)
      .pipe(map((res) => res.data));
  }

  updateDimension(
    id: number,
    dimension: Partial<Dimension>
  ): Observable<Dimension> {
    return this.http.put<Dimension>(`${this.baseUrl}/${id}`, dimension);
  }

  deleteDimension(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }
}
