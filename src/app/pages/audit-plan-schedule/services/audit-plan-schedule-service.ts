import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";

import { environment } from "../../../../environments/environment";
import { lookup } from "../../../shared/models/lookup.mdoel";
import { AuditPlanScheduleInterface } from "../models/audit-plan-schedule";

@Injectable({
  providedIn: "root",
})
export class AuditPlanScheduleService extends BaseService {
  readonly pageName: string = "AuditPlanSchedules";

  // -------- Create --------
  create(payload: AuditPlanScheduleInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Update --------
  update(id: number, payload: AuditPlanScheduleInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Get list --------
  getList(
    auditItemId: string,
    filter: any = {}
  ): Observable<PagedResult<AuditPlanScheduleInterface>> {
    let params = this.buildParams(filter);
    params = params.set("AuditPlanId", auditItemId);
    return this.http
      .get<ApiResponse<PagedResult<AuditPlanScheduleInterface>>>(
        `${this.baseUrl}/${this.pageName}/GetList`,
        { params }
      )
      .pipe(
        map((res) => {
          return {
            ...res.data,
            items: res.data.items.map((item) => ({
              ...item,
              startDate: this.formatDate(item.startDate),
              endDate: this.formatDate(item.endDate),
            })),
          };
        })
      );
  }

  // -------- Get by ID --------
  getById(id: number): Observable<AuditPlanScheduleInterface> {
    return this.http
      .get<ApiResponse<AuditPlanScheduleInterface>>(
        `${this.baseUrl}/${this.pageName}/${id}`
      )
      .pipe(map((res) => res.data));
  }

  // -------- Delete --------
  delete(id: number) {
    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/${this.pageName}/${id}`)
      .pipe(map((res) => res.data));
  }

  // -------- Archive (optional) --------
  archive(id: number) {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/${this.pageName}/${id}/archive`,
        {}
      )
      .pipe(map((res) => res.data));
  }
  // -------- plans lookup --------

  getResourcesLookup(): Observable<lookup[]> {
    return this.http
      .get(`${environment.baseUrl}api/ResourceManagements/lookup`)
      .pipe(map((res: any) => res.data));
  }

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
