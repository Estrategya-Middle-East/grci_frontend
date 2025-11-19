import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal, untracked } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { TableColumn } from "../../../audit/models/interfaces/audit-item";

@Injectable({
  providedIn: "root",
})
export class TestingNatureService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api";
  public testingNatureItemsSignal = signal<any[]>([]);
  public testingNatureHeaderSignal = signal<TableColumn[]>([]);
  public totalItems = signal<number>(0);
  public pagination = signal<{
    pageNumber: number;
    pageSize: number;
  }>({
    pageNumber: 1,
    pageSize: 10,
  });
  testingNatureItems = this.testingNatureItemsSignal.asReadonly();
  testingNatureHeaders = this.testingNatureHeaderSignal.asReadonly();

  getTableData(filters: Object): Observable<any[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<any>(`${this.baseUrl}/TestingNatureManagements`, { params })
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.totalItems();

          // ✅ PrtestingNatureent effect loop using untracked()
          if (current !== totalItems) {
            untracked(() => {
              this.totalItems.set(totalItems);
            });
          }
          const items = (res.data?.items ?? []).map((item: any) => ({
            ...item,
            action: true,
          }));

          this.testingNatureItemsSignal.set(items);
          this.testingNatureHeaderSignal.set([
            { header: "Name", field: "name" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  getTableDataById(filters: Object, id: string): Observable<any[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<any>(`${this.baseUrl}/TestingNatureManagements/${id}`, { params })
      .pipe(map((res) => res.data));
  }

  createtestingNatureManagment(payload: Partial<any>): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/TestingNatureManagements`,
      payload
    );
  }
  edittestingNatureManagment(
    payload: Partial<any>,
    id: string
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/TestingNatureManagements/${id}`,
      payload
    );
  }
  archivetestingNatureManagment(id: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/TestingNatureManagements/${id}/archive`,
      { id }
    );
  }
  deletetestingNatureManamgement(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/TestingNatureManagements/${id}`
    );
  }
}
