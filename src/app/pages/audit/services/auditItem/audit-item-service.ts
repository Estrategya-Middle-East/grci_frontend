import {
  Injectable,
  isSignal,
  signal,
  untracked,
  WritableSignal,
} from "@angular/core";
import {
  AuditItem,
  AuditFilters,
  TableColumn,
  AuditItemsResponse,
} from "../../models/interfaces/audit-item";
import { DimensionsService } from "../../../dimensions/services/dimensions.service";
import { ResourceService } from "../../../resources-management/services/resource";
import { combineLatest, map, Observable } from "rxjs";
import {
  AuditCategories,
  AuditCategory,
  PaginatedData,
} from "../../models/interfaces/audit-categories";
import { environment } from "../../../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  FrequencyData,
  FrequencyResponse,
  RiskCategory,
} from "../../models/interfaces/audit-frequancy";
import {
  EntitiesItem,
  EntitiesResponse,
} from "../../models/interfaces/audit-entities";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import {
  RiskData,
  RiskItem,
  RiskResponse,
} from "../../models/interfaces/audit-risks";
import {
  AddauditItem,
  AddauditItemResponse,
  AddauditItemViewModel,
} from "../../models/interfaces/add-audit-item";
import {
  StorageLocationItem,
  StorageLocationResponse,
} from "../../models/interfaces/location-storage";
import {
  AuditItemScheduleItem,
  AuditItemScheduleResponse,
  AuditItemScheduleTableRow,
} from "../../models/interfaces/audit-item-schedule";
import {
  EngagementItem,
  EngagementResponse,
} from "../../models/interfaces/audit-engagement";

@Injectable({
  providedIn: "root",
})
export class AuditItemService {
  private baseUrl = environment.baseUrl + "api";
  public auditItemsSignal = signal<any[]>([]);
  public auditItemsLookupSignal = signal<EntitiesItem[]>([]);
  public auditItemsResourcesLookupsSignal = signal<EntitiesItem[]>([]);
  public auditResourcesLookupSignal = signal<[]>([]);
  public auditHeaderSignal = signal<TableColumn[]>([]);
  private filtersSignal = signal<{ [key: string]: any }>({});
  private auditPaginationFilter = signal<Object>({});
  public ownerOptions = signal<lookup[]>([]);
  public dimensionOptions = signal<AuditItem[]>([]);
  public categoryOptions = signal<AuditCategory[]>([]);
  public frequencyOptions = signal<FrequencyData[]>([]);
  public entityOptions = signal<EntitiesItem[]>([]);
  public risksOptions = signal<RiskItem[]>([]);
  public pagination = signal<{
    pageNumber: number;
    pageSize: number;
    totalItems?: number;
  }>({
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
  });

  auditItems = this.auditItemsSignal.asReadonly();
  auditHeaders = this.auditHeaderSignal.asReadonly();
  paginationFilter = this.auditPaginationFilter.asReadonly();
  auditItemsLookup = this.auditItemsLookupSignal.asReadonly();
  auditItemsRecourcesLookup =
    this.auditItemsResourcesLookupsSignal.asReadonly();

  filters = this.filtersSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private dimensionsService: DimensionsService,
    private resourceService: ResourceService
  ) {}
  getAllFiltersDropDowns() {
    const dimensionLookups$ = this.dimensionsService.getdiminsionLookup();
    const auditOwners$ = this.resourceService.getUsersLookUp();
    const auditCategories$ = this.getAllCategories();
    const auditFrequencies$ = this.getAllFrequencies();
    const auditEntities$ = this.getAllEntities();
    const auditRisks$ = this.getAllRisks();

    return combineLatest({
      dimensionLookups$,
      auditOwners$,
      auditCategories$,
      auditFrequencies$,
      auditEntities$,
      auditRisks$,
    }).pipe(
      map((res) => {
        this.ownerOptions.set(res.auditOwners$);
        this.dimensionOptions.set(res.dimensionLookups$);
        this.categoryOptions.set(res.auditCategories$);
        this.frequencyOptions.set(res.auditFrequencies$);
        this.entityOptions.set(res.auditEntities$);
        this.risksOptions.set(res.auditRisks$);
      })
    );
  }
  getAuditScheduleDropdowns() {
    // not compoleted
    const auditItemsLookups$ = this.getAuditItemsLookup();
    const auditItemsResourcesLookups$ = this.getAuditItemsResourcesLookup();

    return combineLatest({
      auditItemsLookups$,
      auditItemsResourcesLookups$,
    }).pipe(
      map((res) => {
        this.auditItemsLookupSignal.set(res.auditItemsLookups$);
        this.auditItemsResourcesLookupsSignal.set(
          res.auditItemsResourcesLookups$
        );
      })
    );
  }
  getAuditItemsLookup(): Observable<EntitiesItem[]> {
    return this.http
      .get<EntitiesResponse>(`${this.baseUrl}/AuditItems/lookup`)
      .pipe(map((res) => res.data));
  }
  getAuditItemsResourcesLookup(): Observable<EntitiesItem[]> {
    return this.http
      .get<EntitiesResponse>(`${this.baseUrl}/ResourceManagements/lookup`)
      .pipe(map((res) => res.data));
  }
  getAllRisks(): Observable<RiskItem[]> {
    return this.http
      .get<RiskResponse<RiskData>>(`${this.baseUrl}/Risks/Lookup`)
      .pipe(map((res) => res.data.items));
  }
  getAllCategories(): Observable<AuditCategory[]> {
    return this.http
      .get<AuditCategories<PaginatedData<AuditCategory>>>(
        `${this.baseUrl}/AuditCategories/lookup`
      )
      .pipe(map((res) => res.data.items));
  }
  addCategory(data: object): Observable<any> {
    return this.http.post<AuditCategories<string>>(
      `${this.baseUrl}/AuditCategories`,
      data
    );
  }

  getStorageLocations(): Observable<StorageLocationItem[]> {
    return this.http
      .get<StorageLocationResponse>(`${this.baseUrl}/StorageLocation`)
      .pipe(map((res) => res.data.items));
  }
  getRiskRating(): Observable<RiskItem[]> {
    return this.http
      .get<RiskResponse<RiskItem[]>>(
        `${this.baseUrl}/AuditFrequencies/GetRiskRatingsLookup`
      )
      .pipe(map((res) => res.data));
  }
  getAllFrequencies(): Observable<FrequencyData[]> {
    return this.http
      .get<FrequencyResponse<FrequencyData[]>>(
        `${this.baseUrl}/AuditFrequencies/lookup`
      )
      .pipe(map((res) => res.data));
  }
  getAllEntities(): Observable<EntitiesItem[]> {
    return this.http
      .get<EntitiesResponse>(`${this.baseUrl}/Entities/lookup`)
      .pipe(map((res) => res.data));
  }
  getTableData(filters: Object): Observable<AuditItem[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<AuditItemsResponse>(`${this.baseUrl}/AuditItems/GetList`, { params })
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.pagination();

          // ✅ Prevent effect loop using untracked()
          if (current.totalItems !== totalItems) {
            untracked(() => {
              this.pagination.set({ ...current, totalItems });
            });
          }
          const items = (res.data?.items ?? []).map((item) => ({
            ...item,
            action: true,
          }));

          this.auditItemsSignal.set(items);
          this.auditHeaderSignal.set([
            { header: "Risk Code", field: "code" },
            { header: "Audit item", field: "title" },
            { header: "Dimension", field: "dimensionName" },
            { header: "Entity", field: "entityName" },
            { header: "Audit Category", field: "auditCategoryName" },
            { header: "Estimated effort", field: "estimatedEffort" },
            { header: "Status", field: "status" },
            { header: "Priority level", field: "priority" },
            { header: "Audit Frequency", field: "auditFrequencyName" },
            { header: "Audit Owner", field: "auditOwnerName" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  getAuditEngagementList(filters: Object): Observable<EngagementItem[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<EngagementResponse>(`${this.baseUrl}/AuditEngagements`, { params })
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.pagination();

          // ✅ Prevent effect loop using untracked()
          if (current.totalItems !== totalItems) {
            untracked(() => {
              this.pagination.set({ ...current, totalItems });
            });
          }
          const items = (res.data?.items ?? []).map((item) => ({
            ...item,
            action: true,
          }));

          this.auditItemsSignal.set(items);
          this.auditHeaderSignal.set([
            { header: "Code", field: "id" },
            { header: "Control Automation Name", field: "description" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  getauditItemsScheduleList(
    filters: Object
  ): Observable<AuditItemScheduleItem[]> {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<AuditItemScheduleResponse>(
        `${this.baseUrl}/AuditSchedules/GetList`,
        {
          params,
        }
      )
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.pagination();

          // ✅ Prevent effect loop using untracked()
          if (current.totalItems !== totalItems) {
            untracked(() => {
              this.pagination.set({ ...current, totalItems });
            });
          }
          const items = (res.data?.items ?? []).map((item) => ({
            ...item,
            action: true,

            // join all activity names together
            activityName: (item.keyActivities ?? [])
              .map((act) => act.activityName)
              .join(" | "),

            // join all descriptions together
            description: (item.keyActivities ?? [])
              .map((act) => act.description)
              .join(" | "),
          }));
          this.auditItemsSignal.set(items);
          this.auditHeaderSignal.set([
            { header: "Title", field: "title" },
            { header: "Audit item", field: "auditItemTitle" },
            { header: "Start Date", field: "startDate" },
            { header: "End Date", field: "endDate" },
            { header: "Activity Name", field: "activityName" },
            { header: "Description", field: "description" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  updateFilters(filters: any) {
    this.filtersSignal.update((current) => ({ ...current, ...filters }));
  }

  resetFilters() {
    this.filtersSignal.set({});
  }
  public resetAllSignals(): void {
    const defaultValues: Record<string, any> = {
      auditItemsSignal: [],
      auditHeaderSignal: [
        { header: "Risk Code", field: "code" },
        { header: "Audit item", field: "title" },
        { header: "Dimension", field: "dimensionName" },
        { header: "Entity", field: "entityName" },
        { header: "Audit Category", field: "auditCategoryName" },
        { header: "Estimated effort", field: "estimatedEffort" },
        { header: "Status", field: "status" },
        { header: "Priority level", field: "priority" },
        { header: "Audit Frequency", field: "auditFrequencyName" },
        { header: "Audit Owner", field: "auditOwnerName" },
        { header: "Action", field: "action" },
      ],
      filtersSignal: {},
      auditPaginationFilter: {},
      ownerOptions: [],
      dimensionOptions: [],
      categoryOptions: [],
      frequencyOptions: [],
      entityOptions: [],
      risksOptions: [],
    };

    for (const key of Object.keys(defaultValues)) {
      if (isSignal((this as any)[key])) {
        (this as any)[key].set(defaultValues[key]);
      }
    }
  }

  createAuditItem(
    payload: Partial<AddauditItem>
  ): Observable<AddauditItemResponse> {
    return this.http.post<AddauditItemResponse>(
      `${this.baseUrl}/AuditItems`,
      payload
    );
  }
  editAuditItem(
    payload: Partial<AddauditItem>,
    id: string
  ): Observable<AddauditItemResponse> {
    return this.http.put<AddauditItemResponse>(
      `${this.baseUrl}/AuditItems/${id}`,
      payload
    );
  }
  deleteAuditItem(id: string): Observable<AddauditItemResponse> {
    return this.http.delete<AddauditItemResponse>(
      `${this.baseUrl}/AuditItems/${id}`
    );
  }
  deleteFrequencyAuditItem(id: string): Observable<AddauditItemResponse> {
    return this.http.delete<AddauditItemResponse>(
      `${this.baseUrl}/AuditFrequencies/${id}`
    );
  }
  deleteCategoryAuditItem(id: string): Observable<FrequencyResponse<string>> {
    return this.http.delete<FrequencyResponse<string>>(
      `${this.baseUrl}/AuditCategories/${id}`
    );
  }
  deleteScheduleAuditItem(id: string): Observable<FrequencyResponse<string>> {
    return this.http.delete<FrequencyResponse<string>>(
      `${this.baseUrl}/AuditSchedules/${id}`
    );
  }
  getAuditItemById(id: string): Observable<AddauditItemViewModel> {
    return this.http
      .get<AddauditItemResponse>(`${this.baseUrl}/AuditItems/${id}`)
      .pipe(
        map((res) => {
          const item = res.data;

          // ✅ Convert risks and riskIds to string (comma-separated or empty string)
          const risksString = item.risks?.map((r) => r.riskId).join(", ") || "";
          const riskIdsString = item.riskIds?.join(", ") || "";

          return {
            ...item,
            risks: risksString,
            riskIds: riskIdsString,
          };
        })
      );
  }
  getAuditCategoriestFrequency(filters: Object) {
    let params = new HttpParams();
    // Loop through each filter key and append valid ones
    Object.entries(filters).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.http
      .get<AuditItemsResponse>(`${this.baseUrl}/AuditFrequencies/GetList`, {
        params,
      })
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.pagination();

          // ✅ Prevent effect loop using untracked()
          if (current.totalItems !== totalItems) {
            untracked(() => {
              this.pagination.set({ ...current, totalItems });
            });
          }
          const items = (res.data?.items ?? []).map((item) => ({
            ...item,
            action: true,
          }));
          this.auditItemsSignal.set(items);
          this.auditHeaderSignal.set([
            { header: "Code", field: "id" },
            { header: "Audit Frequency name", field: "name" },
            { header: "Action", field: "action" },
          ]);
          return items;
        })
      );
  }
  getAuditCategoriestList(filters: object): Observable<AuditItem[]> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });

    return this.http
      .get<AuditCategories<PaginatedData<AuditItem>>>(
        `${this.baseUrl}/AuditCategories`,
        { params }
      )
      .pipe(
        map((res) => {
          const totalItems = res.data?.totalItems ?? 0;
          const current = this.pagination();

          // ✅ Prevent effect loop using untracked()
          if (current.totalItems !== totalItems) {
            untracked(() => {
              this.pagination.set({ ...current, totalItems });
            });
          }

          const items: AuditItem[] = (res.data?.items ?? []).map((item) => ({
            ...item,
            action: true,
          }));

          // ✅ Set signals
          this.auditItemsSignal.set(items);
          this.auditHeaderSignal.set([
            { header: "Code", field: "id" },
            { header: "Audit Category name", field: "name" },
            { header: "Storage Location", field: "storageLocationId" },
            { header: "Description", field: "description" },
            { header: "Action", field: "action" },
          ]);

          return items;
        })
      );
  }
  addAuditFrequancy(data: object): Observable<FrequencyResponse<RiskCategory>> {
    return this.http.post<FrequencyResponse<RiskCategory>>(
      `${this.baseUrl}/AuditFrequencies`,
      data
    );
  }
  editAuditFrequancy(
    data: object,
    id: string
  ): Observable<FrequencyResponse<RiskCategory>> {
    return this.http.put<FrequencyResponse<RiskCategory>>(
      `${this.baseUrl}/AuditFrequencies/${id}`,
      data
    );
  }
  editAuditCategory(
    data: object,
    id: string
  ): Observable<FrequencyResponse<string>> {
    return this.http.put<FrequencyResponse<string>>(
      `${this.baseUrl}/AuditCategories/${id}`,
      data
    );
  }
  addAuditCategory(data: object): Observable<FrequencyResponse<string>> {
    return this.http.post<FrequencyResponse<string>>(
      `${this.baseUrl}/AuditCategories`,
      data
    );
  }
  addAuditSchedule(data: object): Observable<AuditItemScheduleResponse> {
    return this.http.post<AuditItemScheduleResponse>(
      `${this.baseUrl}/AuditSchedules`,
      data
    );
  }
  addAuditEngagement(data: object): Observable<FrequencyResponse<string>> {
    return this.http.post<FrequencyResponse<string>>(
      `${this.baseUrl}/AuditEngagements`,
      data
    );
  }
  EditAuditSchedule(
    data: object,
    id: string
  ): Observable<AuditItemScheduleResponse> {
    return this.http.put<AuditItemScheduleResponse>(
      `${this.baseUrl}/AuditSchedules/${id}`,
      data
    );
  }
  EditAuditEngagement(
    data: object,
    id: string
  ): Observable<FrequencyResponse<string>> {
    return this.http.put<FrequencyResponse<string>>(
      `${this.baseUrl}/AuditEngagements/${id}`,
      data
    );
  }
  deleteEngagementAuditItem(id: string): Observable<FrequencyResponse<string>> {
    return this.http.delete<FrequencyResponse<string>>(
      `${this.baseUrl}/AuditEngagements/${id}`
    );
  }
}
