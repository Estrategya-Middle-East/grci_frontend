import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { ApiResponse, PagedResult } from "../../../shared/models/api.mode";
import {
  MitigationPlan,
  MitigationPlanPayload,
} from "../models/mitigation-management";
import { lookup } from "../../../shared/models/lookup.mdoel";

@Injectable({
  providedIn: "root",
})
export class MitigationManagementService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/MitigationPlans";

  getMitigationTypesLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/MitigationTypes/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getMitigationCategoriesLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/MitigationCategories/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getMitigationAutomationsLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/MitigationAutomations/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getMitigationNaturesLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/MitigationNatures/lookup`)
      .pipe(map((res) => res.data.items));
  }

  getMitigationRisksLookup(): Observable<lookup[]> {
    return this.http
      .get<any>(`${environment.baseUrl}api/Risks/Lookup`)
      .pipe(map((res) => res.data.items));
  }

  getMitigationPlans(
    filter: any = {}
  ): Observable<PagedResult<MitigationPlan>> {
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
      .get<ApiResponse<PagedResult<MitigationPlan>>>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getMitigationPlanById(id: number): Observable<MitigationPlan> {
    return this.http
      .get<ApiResponse<MitigationPlan>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createMitigationPlan(plan: MitigationPlanPayload) {
    const formData = this.buildFormData(plan);

    return this.http
      .post<{ data: MitigationPlan }>(this.baseUrl, formData)
      .pipe(map((res) => res.data));
  }

  private buildFormData(plan: MitigationPlanPayload): FormData {
    const formData = new FormData();

    // Helper to ensure UTC ISO format (ending with Z)
    const toIsoString = (date: any): string => {
      if (!date) return "";
      const d = new Date(date);
      return d.toISOString(); // Example: "2025-10-12T16:09:46.890Z"
    };

    formData.append("Name", plan.name);
    formData.append("Description", plan.description ?? "");
    formData.append("ValidityFrom", toIsoString(plan.validityFrom));
    formData.append("ValidityTo", toIsoString(plan.validityTo));
    formData.append("Status", plan.status.toString());
    formData.append(
      "MitigationPlanOwnerId",
      plan.mitigationPlanOwnerId.toString()
    );
    formData.append("MitigationTypeId", plan.mitigationTypeId.toString());
    formData.append(
      "MitigationCategoryId",
      plan.mitigationCategoryId.toString()
    );
    formData.append(
      "MitigationAutomationId",
      plan.mitigationAutomationId.toString()
    );
    formData.append("MitigationNatureId", plan.mitigationNatureId.toString());

    // RiskIds (array)
    plan.riskIds.forEach((id) => {
      formData.append("RiskIds", id.toString());
    });

    // EvidenceAttachments (array of objects)
    plan.evidenceAttachments?.forEach((attachment, index) => {
      formData.append(
        `EvidenceAttachments[${index}].Id`,
        attachment.id.toString()
      );
      formData.append(
        `EvidenceAttachments[${index}].MitigationPlanId`,
        attachment.mitigationPlanId.toString()
      );
      formData.append(`EvidenceAttachments[${index}].Title`, attachment.title);
      formData.append(
        `EvidenceAttachments[${index}].FileType`,
        attachment.fileType.toString()
      );
      formData.append(
        `EvidenceAttachments[${index}].FileUrl`,
        attachment.fileUrl ?? ""
      );

      if (attachment.file) {
        formData.append(
          `EvidenceAttachments[${index}].File`,
          attachment.file,
          attachment.file.name
        );
      }
    });

    return formData;
  }

  updateMitigationPlan(
    id: number,
    plan: MitigationPlanPayload
  ): Observable<MitigationPlan> {
    const formData = this.buildFormData(plan);
    return this.http
      .put<{ data: MitigationPlan }>(`${this.baseUrl}/${id}`, formData)
      .pipe(map((res) => res.data));
  }

  archive(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/archive`, {});
  }

  deleteMitigationPlan(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  removeEvidenceFromMitigationPlan(evidenceId: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/RemoveEvidenceFromMitigationPlan/${evidenceId}`
    );
  }
}
