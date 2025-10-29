import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import {
  RiskAssessmentPayloadInterface,
  RiskManagementInterface,
} from "../models/risk-management";
import { lookup } from "../../../shared/models/lookup.mdoel";

@Injectable({
  providedIn: "root",
})
export class RiskManagementService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/Risks";

  getRisks(filter: any = {}): Observable<PagedResult<RiskManagementInterface>> {
    let params = new HttpParams();

    if (filter.pageNumber !== undefined) {
      params = params.set("PageNumber", filter.pageNumber.toString());
    }
    if (filter.pageSize !== undefined) {
      params = params.set("PageSize", filter.pageSize.toString());
    }

    if (filter.searchTerm) {
      params = params.set("SearchTerm", filter.searchTerm);
    }

    return this.http
      .get<ApiResponse<PagedResult<RiskManagementInterface>>>(
        `${this.baseUrl}/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getRiskById(id: number): Observable<RiskManagementInterface> {
    return this.http
      .get<ApiResponse<RiskManagementInterface>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createRisk(
    risk: Omit<RiskManagementInterface, "id">
  ): Observable<RiskManagementInterface> {
    return this.http
      .post<ApiResponse<RiskManagementInterface>>(this.baseUrl, risk)
      .pipe(map((res) => res.data));
  }

  getUsersLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Users/lookup`)
      .pipe(map((res) => res.data));
  }

  getDimensionsLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Dimensions/lookup`)
      .pipe(map((res) => res.data));
  }

  getRiskCategoriesLookUp(): Observable<any> {
    return this.http
      .get<any>(`${environment.baseUrl}api/RiskCategories/lookup`)
      .pipe(map((res) => res.data));
  }

  getEntitiesLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Entities/lookup`)
      .pipe(map((res) => res.data));
  }

  getProcessGroupLookup(
    entityId: number,
    processType: number
  ): Observable<lookup[]> {
    let params = new HttpParams()
      .set("entityId", entityId)
      .set("processType", processType);
    return this.http
      .get<any>(`${environment.baseUrl}api/ProcessManagements/lookup`, {
        params,
      })
      .pipe(map((res) => res.data));
  }

  getRiskRootCauses(): Observable<
    { id: number; rootCause: string; parent: number; isMainCategory: boolean }[]
  > {
    return this.http
      .get<any>(
        `${environment.baseUrl}api/RiskRootCauses/GetMainCategoriesLookup`
      )
      .pipe(map((res) => res.data));
  }

  loadRootCauseSubCategories(
    parentId: number
  ): Observable<
    { id: number; rootCause: string; parent: number; isMainCategory: boolean }[]
  > {
    return this.http
      .get<any>(
        `${environment.baseUrl}api/RiskRootCauses/${parentId}/SubCategories`
      )
      .pipe(map((res) => res.data));
  }

  getRiskImpactsLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/ImpactScales/lookup`)
      .pipe(map((res) => res.data));
  }

  getRiskLikelihoodLookUp(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/LikelihoodScales/lookup`)
      .pipe(map((res) => res.data));
  }

  assignRiskOwner(riskId: number, ownerId: number) {
    return this.http
      .post<any>(`${this.baseUrl}/${riskId}/ownership`, { ownerId })
      .pipe(map((res) => res.data));
  }

  addRiskAssessment(riskId: number, payload: RiskAssessmentPayloadInterface) {
    return this.http
      .post<any>(`${environment.baseUrl}api/RiskAssessments`, {
        riskId: riskId,
        ...payload,
      })
      .pipe(map((res) => res.data));
  }

  getRiskAssesment(assessmentId: number) {
    return this.http
      .get<any>(`${environment.baseUrl}api/RiskAssessments/${assessmentId}`)
      .pipe(map((res) => res.data));
  }

  getRiskAssesmentList(riskId: number, filter: any = {}) {
    let params = new HttpParams().set("riskId", riskId);

    if (filter.pageNumber !== undefined) {
      params = params.set("PageNumber", filter.pageNumber);
    }
    if (filter.pageSize !== undefined) {
      params = params.set("PageSize", filter.pageSize);
    }

    if (filter.filterField && filter.filterValue) {
      filter.filterField.forEach((field: string, i: number) => {
        const value = filter.filterValue[i];
        if (value !== undefined && field) {
          params = params.set(field, value);
        }
      });
    }

    return this.http
      .get<any>(`${environment.baseUrl}api/RiskAssessments/Getlist`, { params })
      .pipe(map((res) => res.data));
  }

  updateRiskAssessment(
    riskAssessmentId: number,
    payload: RiskAssessmentPayloadInterface
  ) {
    return this.http
      .put<any>(
        `${environment.baseUrl}api/RiskAssessments/${riskAssessmentId}`,
        {
          ...payload,
        }
      )
      .pipe(map((res) => res.data));
  }

  deleteRiskAssessment(riskAssessmentId: number) {
    return this.http
      .delete<any>(
        `${environment.baseUrl}api/RiskAssessments/${riskAssessmentId}`
      )
      .pipe(map((res) => res.data));
  }

  updateRisk(
    id: number,
    risk: Partial<RiskManagementInterface>
  ): Observable<RiskManagementInterface> {
    return this.http
      .put<ApiResponse<RiskManagementInterface>>(`${this.baseUrl}/${id}`, risk)
      .pipe(map((res) => res.data));
  }

  deleteRisk(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  archiveRisk(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }
}
