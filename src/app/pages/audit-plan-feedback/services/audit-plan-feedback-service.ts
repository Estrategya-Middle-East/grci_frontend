import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";
import {
  AuditPlanFeedbackInterface,
  AuditPlanFeedbackPayloadInterface,
} from "../models/audit-plan-feedback";
import { environment } from "../../../../environments/environment";
import { lookup } from "../../../shared/models/lookup.mdoel";

@Injectable({
  providedIn: "root",
})
export class AuditPlanFeedbackService extends BaseService {
  readonly pageName: string = "AuditPlanFeedbacks";

  // -------- Create --------
  create(payload: AuditPlanFeedbackPayloadInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Update --------
  update(id: number, payload: AuditPlanFeedbackPayloadInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Get list --------
  getList(
    auditItemId: string,
    filter: any = {}
  ): Observable<PagedResult<AuditPlanFeedbackInterface>> {
    let params = this.buildParams(filter);
    params = params.set("AuditPlanId", auditItemId);
    return this.http
      .get<ApiResponse<PagedResult<AuditPlanFeedbackInterface>>>(
        `${this.baseUrl}/${this.pageName}/GetList`,
        { params }
      )
      .pipe(
        map((res) => {
          return {
            ...res.data,
            items: res.data.items.map((item) => ({
              ...item,
              reviewedAt: this.formatDate(item.reviewedAt),
            })),
          };
        })
      );
  }

  // -------- Get by ID --------
  getById(id: number): Observable<AuditPlanFeedbackInterface> {
    return this.http
      .get<ApiResponse<AuditPlanFeedbackInterface>>(
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

  getPlansLookup() {
    return this.http
      .get<ApiResponse<lookup[]>>(
        `${environment.baseUrl}api/AuditPlans/GetAuditPlanLookup`
      )
      .pipe(map((res) => res.data));
  }

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
