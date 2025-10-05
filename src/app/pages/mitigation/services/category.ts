import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";
import { CategoryInterface } from "../models/mitigation";

@Injectable({
  providedIn: "root",
})
export class CategoryService extends BaseService {
  readonly pageName: string = "MitigationCategories";

  // -------- Create --------
  create(payload: CategoryInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- Update --------
  update(id: number, payload: CategoryInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  // -------- List --------
  getList(filter: any = {}): Observable<PagedResult<CategoryInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<CategoryInterface>>>(
        `${this.baseUrl}/${this.pageName}`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  // -------- Get by ID --------
  getById(id: number): Observable<CategoryInterface> {
    return this.http
      .get<ApiResponse<CategoryInterface>>(
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
