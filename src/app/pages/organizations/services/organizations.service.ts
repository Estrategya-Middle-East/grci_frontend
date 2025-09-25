import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  City,
  Country,
  Group,
  OrganizationForm,
} from "../models/organization.interface";
import { formatTimeOnly } from "../../../shared/utils/parse-time";

@Injectable({ providedIn: "root" })
export class OrganizationsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + "api/OrganizationalUnits";

  listOrganizations(filter: any = {}): Observable<any> {
    let params = new HttpParams();

    // Add pagination
    if (filter.pageNumber !== undefined)
      params = params.set("PageNumber", filter.pageNumber);
    if (filter.pageSize !== undefined)
      params = params.set("PageSize", filter.pageSize);

    // Convert filterField & filterValue arrays to named query params
    if (filter.filterField && filter.filterValue) {
      filter.filterField.forEach((field: string, i: number) => {
        const value = filter.filterValue[i];
        if (value !== undefined && field) {
          params = params.set(field, value);
        }
      });
    }

    return this.http
      .get<any>(this.baseUrl, { params })
      .pipe(map((res) => res.data));
  }

  getOrganizationById(id: number): Observable<OrganizationForm> {
    return this.http
      .get<{ data: OrganizationForm }>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  createOrganization(
    formValue: OrganizationForm,
    isOrganization: boolean,
    switchHeadquarter: number,
    file: File | null
  ): Observable<OrganizationForm> {
    const formData = this.buildFormData(
      formValue,
      isOrganization,
      switchHeadquarter,
      file
    );
    return this.http
      .post<{ data: OrganizationForm }>(this.baseUrl, formData)
      .pipe(map((res) => res.data));
  }

  updateOrganization(
    id: number,
    formValue: OrganizationForm,
    isOrganization: boolean,
    switchHeadquarter: number,
    file: File | null
  ): Observable<OrganizationForm> {
    const formData = this.buildFormData(
      formValue,
      isOrganization,
      switchHeadquarter,
      file
    );
    return this.http
      .put<{ data: OrganizationForm }>(`${this.baseUrl}/${id}`, formData)
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  archive(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/archive`, {});
  }

  getCountries(): Observable<Country[]> {
    return this.http
      .get<{ data: Country[] }>(`${this.baseUrl}/countries`)
      .pipe(map((res) => res.data));
  }

  getGroupNames(): Observable<Group[]> {
    return this.http
      .get<{ data: Group[] }>(`${this.baseUrl}/groups`)
      .pipe(map((res) => res.data));
  }

  getCities(countryId: number): Observable<City[]> {
    const params = new HttpParams().set("countryId", countryId);
    return this.http
      .get<{ data: City[] }>(`${this.baseUrl}/cities`, { params })
      .pipe(map((res) => res.data));
  }

  private buildFormData(
    formValue: OrganizationForm,
    isOrganization: boolean,
    switchHeadquarter: number,
    file: File | null
  ): FormData {
    const formData = new FormData();

    formData.append("Title", formValue.title);
    formData.append("Description", formValue.description ?? "");
    formData.append("Type", isOrganization ? "1" : "2");
    formData.append("IsGroup", String(!isOrganization));
    formData.append("GroupId", formValue.groupId || "0");
    formData.append("LocationType", switchHeadquarter.toString());
    formData.append("Address", formValue.address);
    formData.append("CountryId", formValue.countryId.toString());
    formData.append("CityId", formValue.cityId?.toString() || "0");
    formData.append("Phone", formValue.phone);
    formData.append(
      "WorkHoursFrom",
      formValue.workHoursFrom ? formatTimeOnly(formValue.workHoursFrom) : ""
    );
    formData.append(
      "WorkHoursTo",
      formValue.workHoursTo ? formatTimeOnly(formValue.workHoursTo) : ""
    );

    if (file) {
      formData.append("LogoFile", file, file.name);
    }

    return formData;
  }
}
