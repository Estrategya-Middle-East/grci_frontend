import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";
import { NatureInterface } from "../models/mitigation";

@Injectable({
  providedIn: "root",
})
export class NatureService extends BaseService {
  readonly pageName: string = "MitigationNatures";

  // -------- Create --------
  create(payload: NatureInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Update --------
  update(id: number, payload: NatureInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- List --------
  getList(filter: any = {}): Observable<PagedResult<NatureInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<NatureInterface>>>(
        `${this.baseUrl}/${this.pageName}`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  // -------- Get by ID --------
  getById(id: number): Observable<NatureInterface> {
    return this.http
      .get<ApiResponse<NatureInterface>>(
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

  // -------- Archive --------
  archive(id: number) {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/${this.pageName}/${id}/archive`,
        {}
      )
      .pipe(map((res) => res.data));
  }
}
