import { inject, Injectable, signal, untracked } from "@angular/core";
import { AuditItemService } from "../auditItem/audit-item-service";
import { environment } from "../../../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

import { BehaviorSubject, combineLatest, map, Observable } from "rxjs";
import {
  AuditItemTeam,
  AuditTeamResponse,
  Skill,
} from "../../models/interfaces/audit-team";
import { ResourceService } from "../../../resources-management/services/resource";
import { lookup } from "../../../../shared/models/lookup.mdoel";

interface editFeedbackpayload {
  show: boolean;
  value: Partial<AuditItemTeam>;
}

@Injectable({
  providedIn: "root",
})
export class AuditTeamService {
  private readonly http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api";
  auditItemsSkillsLookupsSignal = signal<lookup[]>([]);
  public _editFeedback$ = new BehaviorSubject<editFeedbackpayload>({
    show: false,
    value: {},
  });
  auditPlansLookupSignal = signal([]);
  set editFeedback(payload: editFeedbackpayload) {
    this._editFeedback$.next(payload);
  }

  // Getter: returns the current value
  get editFeedback(): editFeedbackpayload {
    return this._editFeedback$.value;
  }

  constructor(
    private auditItemsService: AuditItemService,
    private recourceService: ResourceService
  ) {}

  getLookups() {
    const auditPlan$ = this.getAuditPlanLookups();
    const auditRecources$ = this.recourceService.getResourceSkillsLookUp();

    return combineLatest({ auditPlan$, auditRecources$ }).pipe(
      map((res) => {
        this.auditPlansLookupSignal.set(res.auditPlan$);
        this.auditItemsSkillsLookupsSignal.set(res.auditRecources$);
      })
    );
  }
  getAuditPlanLookups() {
    return this.http
      .get<any>(`${this.baseUrl}/AuditPlans/GetAuditPlanLookup`)
      .pipe(map((res) => res.data));
  }
  getAuditItemsbyAuditPlanLookups(auditPlanId: string): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.baseUrl}/AuditItems/lookup/by-audit-plan/${auditPlanId}`
      )
      .pipe(map((res) => res.data));
  }
  getTableData(filters: Object): Observable<AuditItemTeam[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<AuditTeamResponse>(`${this.baseUrl}/AuditTeam`, {
        params,
      })
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.auditItemsService.pagination();

          // ✅ Prevent effect loop using untracked()
          if (current.totalItems !== totalItems) {
            untracked(() => {
              this.auditItemsService.pagination.set({ ...current, totalItems });
            });
          }
          const items = (res.data?.items ?? []).map((item: any) => ({
            ...item,
            skills: item.skills
              .map((s: Skill) => s.resourceSkillName)
              .join(" | "),
            allSkills: item.skills.map((s: Skill) => ({
              id: s.resourceSkillId,
              name: s.resourceSkillName,
            })),
            action: true,
          }));

          this.auditItemsService.auditItemsSignal.set(items);
          this.auditItemsService.auditHeaderSignal.set([
            { header: "Audit Plan", field: "auditPlanId" },
            { header: "Audit item Title", field: "auditItemName" },
            { header: "Audit Role", field: "auditRole" },
            { header: "Contribution Resource", field: "contributionResource" },
            { header: "Total Hours", field: "totalHours" },
            { header: "Skills", field: "skills" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  updateAuditTeam(id: string, auditCycle: Partial<any>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/AuditTeam/${id}`, auditCycle);
  }
  createAuditTeam(auditCycle: Partial<any>): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/AuditTeam`, auditCycle);
  }

  deleteAuditTeam(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/AuditTeam/${id}`);
  }
}
