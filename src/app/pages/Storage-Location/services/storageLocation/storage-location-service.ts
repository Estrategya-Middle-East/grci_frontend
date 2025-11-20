import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal, untracked } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { TableColumn } from "../../../audit/models/interfaces/audit-item";
import {
  Item,
  storageLocationApiResponse,
} from "../../models/storage-location-interface";
import { PaginatedData } from "../../../audit/models/interfaces/audit-categories";

@Injectable({
  providedIn: "root",
})
export class StorageLocationService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api";
  public storageLocationItemsSignal = signal<any[]>([]);
  public storageLocationHeaderSignal = signal<TableColumn[]>([]);
  public totalItems = signal<number>(0);
  public pagination = signal<{
    pageNumber: number;
    pageSize: number;
  }>({
    pageNumber: 1,
    pageSize: 10,
  });
  storageLocationItems = this.storageLocationItemsSignal.asReadonly();
  storageLocationHeaders = this.storageLocationHeaderSignal.asReadonly();

  getTableData(filters: Object): Observable<Item[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<storageLocationApiResponse<PaginatedData<Item>>>(
        `${this.baseUrl}/StorageLocation`,
        { params }
      )
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.totalItems();

          // ✅ PrstorageLocationent effect loop using untracked()
          if (current !== totalItems) {
            untracked(() => {
              this.totalItems.set(totalItems);
            });
          }
          const items = (res.data?.items ?? []).map((item: any) => ({
            ...item,
            action: true,
          }));

          this.storageLocationItemsSignal.set(items);
          this.storageLocationHeaderSignal.set([
            { header: "Name", field: "name" },
            { header: "Set As Default", field: "default" },
            { header: "Notes", field: "notes" },
            { header: "Path", field: "path" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  getTableDataById(filters: Object, id: string): Observable<Item> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });

    return this.http
      .get<{ data: Item }>(`${this.baseUrl}/StorageLocation/${id}`, { params })
      .pipe(map((res) => res.data));
  }

  createstorageLocation(payload: Partial<any>): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/StorageLocation`, payload);
  }
  editstorageLocation(payload: Partial<any>, id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/StorageLocation/${id}`, payload);
  }
  archivestorageLocation(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/StorageLocation/${id}/archive`, {
      id,
    });
  }
  deletestorageLocation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/StorageLocation/${id}`);
  }
}
