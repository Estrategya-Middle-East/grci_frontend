import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { ResourceInterface } from "../models/resource";
import { lookup } from "../../../shared/models/lookup.mdoel";

@Injectable({
  providedIn: "root",
})
export class ResourceService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/ResourceManagements";

  getResources(filter: any = {}): Observable<PagedResult<ResourceInterface>> {
    let params = new HttpParams();

    if (filter.pageNumber !== undefined) {
      params = params.set("PageNumber", filter.pageNumber.toString());
    }
    if (filter.pageSize !== undefined) {
      params = params.set("PageSize", filter.pageSize.toString());
    }

    return this.http
      .get<ApiResponse<PagedResult<ResourceInterface>>>(this.baseUrl, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  getResourceById(id: number): Observable<ResourceInterface> {
    return this.http
      .get<ApiResponse<ResourceInterface>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }

  createResource(
    resource: Omit<ResourceInterface, "id">
  ): Observable<ResourceInterface> {
    return this.http
      .post<ApiResponse<ResourceInterface>>(this.baseUrl, resource)
      .pipe(map((res) => res.data));
  }

  updateResource(
    id: number,
    resource: Partial<ResourceInterface>
  ): Observable<ResourceInterface> {
    return this.http
      .put<ApiResponse<ResourceInterface>>(`${this.baseUrl}/${id}`, resource)
      .pipe(map((res) => res.data));
  }

  deleteResource(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  getResourceFunctionsLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/ResourceFunctions/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getResourceSkillsLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/ResourceSkills/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getUsersLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Users/lookup`)
      .pipe(map((res) => res.data));
  }
}
