import { inject, Injectable, signal, untracked } from "@angular/core";
import { TableColumn } from "../../../audit/models/interfaces/audit-item";
import { environment } from "../../../../../environments/environment";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { AuditCategory } from "../../../audit/models/interfaces/audit-categories";
import { EntitiesItem } from "../../../audit/models/interfaces/audit-entities";
import { FrequencyData } from "../../../audit/models/interfaces/audit-frequancy";
import { RiskItem } from "../../../audit/models/interfaces/audit-risks";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EVManagmentService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api";
  public EVItemsSignal = signal<any[]>([]);
  public EVHeaderSignal = signal<TableColumn[]>([]);
  private EVPaginationFilter = signal<Object>({});
  public totalItems = signal<number>(0);
  public pagination = signal<{
    pageNumber: number;
    pageSize: number;
  }>({
    pageNumber: 1,
    pageSize: 10,
  });
  EVItems = this.EVItemsSignal.asReadonly();
  EVHeaders = this.EVHeaderSignal.asReadonly();

  getTableData(filters: Object): Observable<any[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<any>(`${this.baseUrl}/EvidenceLevelManagements`, { params })
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.totalItems();

          // ✅ Prevent effect loop using untracked()
          if (current !== totalItems) {
            untracked(() => {
              this.totalItems.set(totalItems);
            });
          }
          const items = (res.data?.items ?? []).map((item: any) => ({
            ...item,
            action: true,
          }));

          this.EVItemsSignal.set(items);
          this.EVHeaderSignal.set([
            { header: "Description", field: "description" },
            { header: "Name", field: "name" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  createEvManagment(payload: Partial<any>): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/EvidenceLevelManagements`,
      payload
    );
  }
  editEvManagment(payload: Partial<any>, id: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/EvidenceLevelManagements/${id}`,
      payload
    );
  }
  deleteEvManamgement(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/EvidenceLevelManagements/${id}`
    );
  }
}
