import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, Signal, signal } from "@angular/core";
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
  private _deleteSignal = signal<any | null>(null);
  private _archiveSignal = signal<any | null>(null);
  private _closeDialog = signal<any | null>(null);
  private baseUrl = "api/OrganizationalUnits";

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http
      .get<any>(`${environment.baseUrl}${this.baseUrl}/countries`)
      .pipe(map((res) => res.data as Country[]));
  }

  getGroupNames(): Observable<Group[]> {
    return this.http
      .get<any>(`${environment.baseUrl}${this.baseUrl}/groups`)
      .pipe(map((res) => res.data as Group[]));
  }

  getCities(countryId: number): Observable<City[]> {
    const params = new HttpParams().set("countryId", countryId);
    return this.http
      .get<any>(`${environment.baseUrl}${this.baseUrl}/cities`, { params })
      .pipe(map((res) => res.data as City[]));
  }

  createOrganization(
    formValue: OrganizationForm,
    isOrganization: boolean,
    switchHeadquarter: number,
    file: File | null
  ): Observable<any> {
    const formData = this.buildFormData(
      formValue,
      isOrganization,
      switchHeadquarter,
      file
    );
    return this.http.post(`${environment.baseUrl}${this.baseUrl}`, formData);
  }

  updateOrganization(
    id: number,
    formValue: OrganizationForm,
    isOrganization: boolean,
    switchHeadquarter: number,
    file: File | null
  ): Observable<any> {
    const formData = this.buildFormData(
      formValue,
      isOrganization,
      switchHeadquarter,
      file
    );
    return this.http.put(
      `${environment.baseUrl}${this.baseUrl}/${id}`,
      formData
    );
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

  getOrganizationById(id: number): Observable<OrganizationForm> {
    return this.http
      .get<any>(`${environment.baseUrl}api/OrganizationalUnits/${id}`)
      .pipe(map((res) => res.data as OrganizationForm));
  }

  listOrganizations(filter: any): Observable<any> {
    let queryParams = new HttpParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      });
    }

    return this.http.get<any>(`${environment.baseUrl}api/OrganizationalUnits`, {
      params: queryParams,
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.baseUrl}api/OrganizationalUnits/${id}`
    );
  }

  archive(id: number): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}api/OrganizationalUnits/${id}/archive/`,
      {}
    );
  }

  get readDeleteSignal(): Signal<any | null> {
    return this._deleteSignal.asReadonly();
  }

  get readArchiveSignal(): Signal<any | null> {
    return this._archiveSignal.asReadonly();
  }

  get getDeleteSignal(): Signal<any | null> {
    return this._deleteSignal;
  }

  get getArchiveSignal(): Signal<any | null> {
    return this._archiveSignal;
  }

  get getCloseDialog(): Signal<any | null> {
    return this._closeDialog;
  }

  triggerDelete(data: any) {
    this._deleteSignal.set(data);
  }

  triggerArchive(data: any) {
    this._archiveSignal.set(data);
  }

  closeDialog() {
    this._closeDialog.set(true);
  }

  clear() {
    this._deleteSignal.set(null);
    this._archiveSignal.set(null);
  }
}
