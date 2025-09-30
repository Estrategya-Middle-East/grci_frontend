import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class BaseService {
  protected http = inject(HttpClient);
  protected baseUrl = `${environment.baseUrl}api`;

  protected buildParams(filter: any): HttpParams {
    let params = new HttpParams();

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

    return params;
  }
}
