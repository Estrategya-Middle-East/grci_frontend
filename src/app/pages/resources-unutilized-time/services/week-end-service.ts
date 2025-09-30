import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { WeekEndInterface } from "../models/resources-unutilized-time";
import { BaseService } from "./base-service";

@Injectable({
  providedIn: "root",
})
export class WeekEndService extends BaseService {
  readonly pageName: string = "ResourceWeekEnds";
  create(payload: { day: string }) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  update(id: number, payload: { day: string; id: number }) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  getList(filter: any = {}): Observable<PagedResult<WeekEndInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<any>>>(
        `${this.baseUrl}/${this.pageName}/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<WeekEndInterface> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/${this.pageName}/${id}`)
      .pipe(map((res) => res.data));
  }

  delete(id: number) {
    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/${this.pageName}/${id}`)
      .pipe(map((res) => res.data));
  }

  archive(id: number) {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/${this.pageName}/${id}/archive`,
        {}
      )
      .pipe(map((res) => res.data));
  }
}
