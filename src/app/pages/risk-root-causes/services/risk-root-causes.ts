import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";
import {
  RiskRootCauseInterface,
  RiskRootCausePayloadInterface,
} from "../models/risk-root-causes";

@Injectable({
  providedIn: "root",
})
export class RiskRootCausesService extends BaseService {
  readonly pageName: string = "RiskRootCauses";

  // -------- Create --------
  create(payload: RiskRootCausePayloadInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Update --------
  update(id: number, payload: RiskRootCausePayloadInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Get list --------
  getList(filter: any = {}): Observable<PagedResult<RiskRootCauseInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<RiskRootCauseInterface>>>(
        `${this.baseUrl}/${this.pageName}/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  // -------- Get by ID --------
  getById(id: number): Observable<RiskRootCauseInterface> {
    return this.http
      .get<ApiResponse<RiskRootCauseInterface>>(
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

  // -------- Archive (optional, keep same pattern) --------
  archive(id: number) {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/${this.pageName}/${id}/archive`,
        {}
      )
      .pipe(map((res) => res.data));
  }

  // -------- Lookups --------
  getMainCategoriesLookup(): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/${this.pageName}/GetMainCategoriesLookup`
      )
      .pipe(map((res) => res.data));
  }

  getSubCategories(parentId: number): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(
        `${this.baseUrl}/${this.pageName}/${parentId}/SubCategories`
      )
      .pipe(map((res) => res.data));
  }
}
