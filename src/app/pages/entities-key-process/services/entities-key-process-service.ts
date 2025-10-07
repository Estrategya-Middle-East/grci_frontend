import { inject, Injectable } from "@angular/core";
import { ProcessManagement } from "../models/key-process/key-process";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { map, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EntitiesKeyProcessService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/ProcessManagements";

  getProcessManagements(
    filter: any = {}
  ): Observable<PagedResult<ProcessManagement>> {
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
      .get<ApiResponse<PagedResult<ProcessManagement>>>(this.baseUrl, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  getHierarchy(entityId: string | null): Observable<ProcessManagement[]> {
    return this.http
      .get<ApiResponse<ProcessManagement[]>>(
        `${this.baseUrl}/hierarchy/${entityId}`
      )
      .pipe(map((res) => res.data));
  }

  getPotentialParent(entityId: string, type: number) {
    let params = new HttpParams()
      .set("entityId", entityId)
      .set("processType", type.toString());

    return this.http
      .get<ApiResponse<ProcessManagement[]>>(
        `${this.baseUrl}/potential-parents`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getProcessManagementById(id: number): Observable<ProcessManagement> {
    return this.http
      .get<ApiResponse<ProcessManagement>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createProcessManagement(
    process: Omit<
      ProcessManagement,
      | "id"
      | "entityName"
      | "parentName"
      | "processOwnerName"
      | "processOwnerEmail"
      | "children"
      | "hasChildren"
    >
  ): Observable<ProcessManagement> {
    return this.http
      .post<ApiResponse<ProcessManagement>>(this.baseUrl, process)
      .pipe(map((res) => res.data));
  }

  updateProcessManagement(
    id: number,
    process: Partial<ProcessManagement>
  ): Observable<ProcessManagement> {
    return this.http
      .put<ApiResponse<ProcessManagement>>(`${this.baseUrl}/${id}`, process)
      .pipe(map((res) => res.data));
  }

  deleteProcessManagement(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }
}
