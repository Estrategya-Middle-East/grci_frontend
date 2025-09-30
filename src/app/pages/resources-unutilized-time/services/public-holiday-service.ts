import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { PublicHolidayInterface } from "../models/resources-unutilized-time";
import { BaseService } from "./base-service";

@Injectable({
  providedIn: "root",
})
export class PublicHolidayService extends BaseService {
  readonly pageName: string = "ResourcePublicHolidays";

  create(payload: { title: string; date: string }) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  update(id: number, payload: { title: string; date: string; id: number }) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  getList(filter: any = {}): Observable<PagedResult<PublicHolidayInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<any>>>(
        `${this.baseUrl}/${this.pageName}/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<PublicHolidayInterface> {
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
