import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { lookup } from "../../../shared/models/lookup.mdoel";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { Control, ControlPayload } from "../models/control-management";

@Injectable({
  providedIn: "root",
})
export class ControlManagementService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/Controls";

  getControlCategoriesLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/ControlCategories/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getControlSignificancesLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/ControlSignificances/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getControlAutomationsLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/ControlAutomations/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getControlNaturesLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/ControlNatures/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getRisks(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Risks/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getControls(filter: any = {}): Observable<PagedResult<Control>> {
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
      .get<ApiResponse<PagedResult<Control>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getControlById(id: number): Observable<Control> {
    return this.http
      .get<ApiResponse<Control>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createControl(control: ControlPayload): Observable<Control> {
    const payload = this.transformPayload(control);
    return this.http
      .post<{ data: Control }>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  updateControl(id: number, control: ControlPayload): Observable<Control> {
    const payload = this.transformPayload(control);
    return this.http
      .put<{ data: Control }>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  deleteControl(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  private transformPayload(control: ControlPayload) {
    return {
      ...control,
      validityFrom:
        control.validityFrom instanceof Date
          ? control.validityFrom.toISOString()
          : control.validityFrom,
      validityTo:
        control.validityTo instanceof Date
          ? control.validityTo.toISOString()
          : control.validityTo,
      riskIds: control.riskIds,
    };
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }
}
