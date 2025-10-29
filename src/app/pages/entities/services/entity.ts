import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { EntityInterface } from "../models/entity";
import { lookup } from "../../../shared/models/lookup.mdoel";

@Injectable({
  providedIn: "root",
})
export class Entity {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/Entities";

  getEntities(filter: any = {}): Observable<PagedResult<EntityInterface>> {
    let params = new HttpParams();

    if (filter.pageNumber !== undefined)
      params = params.set("PageNumber", filter.pageNumber);
    if (filter.pageSize !== undefined)
      params = params.set("PageSize", filter.pageSize);

    // Convert filterField & filterValue arrays to named query params
    if (filter.filterField && filter.filterValue) {
      filter.filterField.forEach((field: string, i: number) => {
        const value = filter.filterValue[i];
        if (value !== undefined && field) {
          params = params.set(field, value);
        }
      });
    }

    return this.http
      .get<ApiResponse<PagedResult<EntityInterface>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getEntityById(id: number): Observable<EntityInterface> {
    return this.http
      .get<ApiResponse<EntityInterface>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createEntity(
    entity: Omit<EntityInterface, "id">
  ): Observable<EntityInterface> {
    return this.http
      .post<ApiResponse<EntityInterface>>(this.baseUrl, entity)
      .pipe(map((res) => res.data));
  }

  updateEntity(
    id: number,
    entity: Partial<EntityInterface>
  ): Observable<EntityInterface> {
    return this.http
      .put<ApiResponse<EntityInterface>>(`${this.baseUrl}/${id}`, entity)
      .pipe(map((res) => res.data));
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }

  deleteEntity(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }
  getEntitiesLookups(){
    
  }
  getOrganizationalUnitLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/OrganizationalUnits/lookup`)
      .pipe(map((res) => res.data));
  }

  getDimensionsLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Dimensions/lookup`)
      .pipe(map((res) => res.data));
  }

  getPotentialParents(orgId: number, levelId: number): Observable<lookup[]> {
    return this.http
      .get<any>(`${this.baseUrl}/potential-parents`, {
        params: { organizationId: orgId, level: levelId },
      })
      .pipe(map((res) => res.data));
  }

  getOrgChartLevels(): Observable<lookup[]> {
    return this.http
      .get<any>(`${this.baseUrl}/org-chart-levels`)
      .pipe(map((res) => res.data));
  }
}
