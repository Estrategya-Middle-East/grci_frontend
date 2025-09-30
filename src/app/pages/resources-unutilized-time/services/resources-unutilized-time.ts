import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import {
  LeaveDay,
  PublicHoliday,
  WeekEnd,
} from "../models/resources-unutilized-time";

@Injectable({
  providedIn: "root",
})
export class ResourcesUnutilizedTime {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}api`;

  // -------- Week Ends --------
  createWeekEnd(payload: { day: string }) {
    return this.http
      .post(`${this.baseUrl}/ResourceWeekEnds`, payload)
      .pipe(map((res: any) => res.data));
  }

  updateWeekEnd(id: number, payload: { day: string; id: number }) {
    return this.http
      .put(`${this.baseUrl}/ResourceWeekEnds/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  getWeekEnds(filter: any = {}): Observable<PagedResult<WeekEnd>> {
    let params = this.buildParams(filter);

    return this.http
      .get<ApiResponse<PagedResult<any>>>(
        `${this.baseUrl}/ResourceWeekEnds/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getWeekEndById(id: number): Observable<WeekEnd> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/ResourceWeekEnds/${id}`)
      .pipe(map((res) => res.data));
  }

  deleteWeekEnd(id: number) {
    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/ResourceWeekEnds/${id}`)
      .pipe(map((res) => res.data));
  }

  archiveWeekEnd(id: number) {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/ResourceWeekEnds/${id}/archive`,
        {}
      )
      .pipe(map((res) => res.data));
  }

  // -------- Public Holidays --------
  getPublicHolidaysByYear(
    year: number
  ): Observable<{ id: number; title: string }[]> {
    return this.http
      .get<ApiResponse<{ id: number; title: string }[]>>(
        `${this.baseUrl}/ResourcePublicHolidays/GetByYear/${year}`
      )
      .pipe(map((res) => res.data));
  }

  createPublicHolidays(payload: { title: string; date: string }) {
    return this.http
      .post(`${this.baseUrl}/ResourcePublicHolidays`, payload)
      .pipe(map((res: any) => res.data));
  }

  updatePublicHolidays(
    id: number,
    payload: { title: string; date: string; id: number }
  ) {
    return this.http
      .put(`${this.baseUrl}/ResourcePublicHolidays/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  getPublicHolidays(filter: any = {}): Observable<PagedResult<PublicHoliday>> {
    let params = this.buildParams(filter);

    return this.http
      .get<ApiResponse<PagedResult<any>>>(
        `${this.baseUrl}/ResourcePublicHolidays/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getPublicHolidayById(id: number): Observable<PublicHoliday> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/ResourcePublicHolidays/${id}`)
      .pipe(map((res) => res.data));
  }

  deletePublicHoliday(id: number) {
    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/ResourcePublicHolidays/${id}`)
      .pipe(map((res) => res.data));
  }

  archivePublicHoliday(id: number) {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/ResourcePublicHolidays/${id}/archive`,
        {}
      )
      .pipe(map((res) => res.data));
  }

  // -------- Leave Days --------
  getLeaveDays(filter: any = {}): Observable<PagedResult<LeaveDay>> {
    let params = this.buildParams(filter);

    return this.http
      .get<ApiResponse<PagedResult<any>>>(
        `${this.baseUrl}/ResourceLeaveDays/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getLeaveDayById(id: number): Observable<LeaveDay> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/ResourceLeaveDays/${id}`)
      .pipe(map((res) => res.data));
  }

  deleteLeaveDay(id: number) {
    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/ResourceLeaveDays/${id}`)
      .pipe(map((res) => res.data));
  }

  archiveLeaveDay(id: number) {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/ResourceLeaveDays/${id}/archive`,
        {}
      )
      .pipe(map((res) => res.data));
  }

  // -------- Shared param builder --------
  private buildParams(filter: any): HttpParams {
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

    return params;
  }
}
