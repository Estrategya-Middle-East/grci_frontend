import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";
import { TypeInterface } from "../models/mitigation";

@Injectable({
  providedIn: "root",
})
export class TypeService extends BaseService {
  readonly pageName: string = "MitigationTypes";

  // -------- Create --------
  create(payload: TypeInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Update --------
  update(id: number, payload: TypeInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- List --------
  getList(filter: any = {}): Observable<PagedResult<TypeInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<TypeInterface>>>(
        `${this.baseUrl}/${this.pageName}`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  // -------- Get by ID --------
  getById(id: number): Observable<TypeInterface> {
    return this.http
      .get<ApiResponse<TypeInterface>>(`${this.baseUrl}/${this.pageName}/${id}`)
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
