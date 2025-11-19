import { inject, Injectable, untracked } from "@angular/core";
import { AuditItemService } from "../auditItem/audit-item-service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import {
  AuditItem,
  AuditItemsResponse,
} from "../../models/interfaces/audit-item";
import { environment } from "../../../../../environments/environment";
import {
  ApiResponse,
  FeedbackItem,
} from "../../models/interfaces/audit-feedback";
import {
  EntitiesItem,
  EntitiesResponse,
} from "../../models/interfaces/audit-entities";
interface editFeedbackpayload {
  show: boolean;
  value: Partial<FeedbackItem>;
}
@Injectable({
  providedIn: "root",
})
export class AuditFeedbackService {
  private readonly http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api";
  addEditFeedback!: editFeedbackpayload;

  set editFeedback(editFeedbackpayload: editFeedbackpayload) {
    this.addEditFeedback = editFeedbackpayload;
  }
  get editFeedback() {
    return this.addEditFeedback;
  }

  constructor(private auditItemsService: AuditItemService) {
    this.editFeedback = {
      show: false,
      value: {},
    };
  }
  getAuditItemsLookup(): Observable<EntitiesItem[]> {
    return this.http
      .get<EntitiesResponse>(`${this.baseUrl}/AuditItems/lookup`)
      .pipe(map((res) => res.data));
  }
  getTableData(filters: Object): Observable<FeedbackItem[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<ApiResponse>(`${this.baseUrl}/AuditItemFeedbacks/GetList`, {
        params,
      })
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.auditItemsService.totalItems();

          // ✅ Prevent effect loop using untracked()
          if (current !== totalItems) {
            untracked(() => {
              this.auditItemsService.totalItems.set(totalItems);
            });
          }
          const items = (res.data?.items ?? []).map((item) => ({
            ...item,
            action: true,
          }));

          this.auditItemsService.auditItemsSignal.set(items);
          this.auditItemsService.auditHeaderSignal.set([
            { header: "Code", field: "auditItemCode" },
            { header: "Audit item Title", field: "auditItemTitle" },
            { header: "Status", field: "status" },
            { header: "Feedback", field: "feedback" },
            { header: "Reviewed By Name", field: "reviewedByName" },
            { header: "Reviewed At", field: "reviewedAt" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  updateAuditFeedback(
    id: string,
    auditCycle: Partial<FeedbackItem>
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.baseUrl}/AuditItemFeedbacks/${id}`,
      auditCycle
    );
  }
  createAuditFeedback(
    auditCycle: Partial<FeedbackItem>
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/AuditItemFeedbacks`,
      auditCycle
    );
  }

  deleteAuditFeedback(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.baseUrl}/AuditItemFeedbacks/${id}`
    );
  }
}
