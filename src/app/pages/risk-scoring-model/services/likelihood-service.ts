import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";
import { LikelihoodInterface } from "../models/risk-scoring";

@Injectable({
  providedIn: "root",
})
export class LikelihoodService extends BaseService {
  readonly pageName: string = "LikelihoodScales";

  create(payload: LikelihoodInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  update(id: number, payload: LikelihoodInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  getList(filter: any = {}): Observable<PagedResult<LikelihoodInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<LikelihoodInterface>>>(
        `${this.baseUrl}/${this.pageName}`,
        {
          params,
        }
      )
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<LikelihoodInterface> {
    return this.http
      .get<ApiResponse<LikelihoodInterface>>(
        `${this.baseUrl}/${this.pageName}/${id}`
      )
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
