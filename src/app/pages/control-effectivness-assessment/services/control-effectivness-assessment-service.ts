import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import { BaseService } from "../../../core/services/base-service";
import { ControlEffectivnessAssessmentInterface } from "../models/control-effectivness-assessment";
import { lookup } from "../../../shared/models/lookup.mdoel";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ControlEffectivnessAssessmentService extends BaseService {
  readonly pageName = "ControlEffectivenessAssessments";

  create(payload: ControlEffectivnessAssessmentInterface) {
    return this.http
      .post(`${this.baseUrl}/${this.pageName}`, payload)
      .pipe(map((res: any) => res.data));
  }

  update(id: number, payload: ControlEffectivnessAssessmentInterface) {
    return this.http
      .put(`${this.baseUrl}/${this.pageName}/${id}`, payload)
      .pipe(map((res: any) => res.data));
  }

  getList(
    filter: any = {}
  ): Observable<PagedResult<ControlEffectivnessAssessmentInterface>> {
    const params = this.buildParams(filter);
    return this.http
      .get<ApiResponse<PagedResult<ControlEffectivnessAssessmentInterface>>>(
        `${this.baseUrl}/${this.pageName}/GetList`,
        { params }
      )
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<ControlEffectivnessAssessmentInterface> {
    return this.http
      .get<ApiResponse<ControlEffectivnessAssessmentInterface>>(
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

  getControlsLookup(): Observable<lookup[]> {
    return this.http
      .get(`${environment.baseUrl}api/Controls/lookup`)
      .pipe(map((res: any) => res.data));
  }

  getRisksLookup(): Observable<lookup[]> {
    return this.http
      .get(`${environment.baseUrl}api/Controls/control-risks/lookup`)
      .pipe(map((res: any) => res.data));
  }
}
