import { inject, Injectable, signal } from "@angular/core";
import { AuditItemService } from "../auditItem/audit-item-service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  AuditCycle,
  AuditCycleParams,
  PagedResponse,
} from "../../models/interfaces/audit-cycle";
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuditCycleService {
  private readonly http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api";
  public auditCycles = signal<any[]>([]);
  public totalRecords = signal(0);
  getAuditCycles(
    params: AuditCycleParams = {}
  ): Observable<PagedResponse<AuditCycle>> {
    let httpParams = new HttpParams();

    if (params.pageNumber) {
      httpParams = httpParams.set("pageNumber", params.pageNumber.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set("pageSize", params.pageSize.toString());
    }
    if (params.searchTerm) {
      httpParams = httpParams.set("searchTerm", params.searchTerm);
    }
    if (params.sortBy) {
      httpParams = httpParams.set("sortBy", params.sortBy);
    }
    if (params.sortOrder) {
      httpParams = httpParams.set("sortOrder", params.sortOrder);
    }

    return this.http.get<PagedResponse<AuditCycle>>(
      `${this.baseUrl}/AuditCycles/GetList`,
      { params: httpParams }
    );
  }

  getAuditCycleById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/AuditCycles/${id}`);
  }

  createAuditCycle(auditCycle: Partial<AuditCycle>): Observable<AuditCycle> {
    return this.http.post<AuditCycle>(
      `${this.baseUrl}/AuditCycles`,
      auditCycle
    );
  }

  updateAuditCycle(
    id: string,
    auditCycle: Partial<AuditCycle>
  ): Observable<AuditCycle> {
    return this.http.put<AuditCycle>(
      `${this.baseUrl}/AuditCycles/${id}`,
      auditCycle
    );
  }

  deleteAuditCycle(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/AuditCycles/${id}`);
  }
}
