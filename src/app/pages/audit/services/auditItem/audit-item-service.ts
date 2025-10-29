import { Injectable, isSignal, signal, WritableSignal } from '@angular/core';
import { AuditItem, AuditFilters, TableColumn, AuditItemsResponse } from '../../models/interfaces/audit-item';
import { DimensionsService } from '../../../dimensions/services/dimensions.service';
import { ResourceService } from '../../../resources-management/services/resource';
import { combineLatest, map, Observable } from 'rxjs';
import { AuditCategories, AuditCategory, PaginatedData } from '../../models/interfaces/audit-categories';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {  FrequencyData, FrequencyResponse } from '../../models/interfaces/audit-frequancy';
import { EntitiesItem, EntitiesResponse } from '../../models/interfaces/audit-entities';
import { lookup } from '../../../../shared/models/lookup.mdoel';
import { RiskItem, RiskResponse } from '../../models/interfaces/audit-risks';
import { AddauditItem, AddauditItemResponse, AddauditItemViewModel } from '../../models/interfaces/add-audit-item';
import { StorageLocationItem, StorageLocationResponse } from '../../models/interfaces/location-storage';

@Injectable({
  providedIn: 'root'
})
export class AuditItemService {


  private baseUrl = environment.baseUrl + "api";
  public auditItemsSignal = signal<AuditItem[]>([]);
  public auditHeaderSignal = signal<TableColumn[]>([
    { header: 'Risk Code', field: 'code' },
    { header: 'Audit item', field: 'title' },
    { header: 'Dimension', field: 'dimensionName' },
    { header: 'Entity', field: 'entityName' },
    { header: 'Audit Category', field: 'auditCategoryName' },
    { header: 'Estimated effort', field: 'estimatedEffort' },
    { header: 'Status', field: 'status' },
    { header: 'Priority level', field: 'priority' },
    { header: 'Audit Frequency', field: 'auditFrequencyName' },
    { header: 'Audit Owner', field: 'auditOwnerName' },
    { header: 'Action', field: 'action' }
  ]);
  private filtersSignal = signal<{ [key: string]: any }>({});
  private auditPaginationFilter = signal<Object>({})
    public ownerOptions = signal<lookup[]>([])
    public dimensionOptions = signal<AuditItem[]>([])
    public categoryOptions = signal<AuditCategory[]>([])
    public frequencyOptions = signal<FrequencyData[]>([])
    public entityOptions = signal<EntitiesItem[]>([])
    public risksOptions = signal<RiskItem[]>([])

  auditItems = this.auditItemsSignal.asReadonly();
  auditHeaders = this.auditHeaderSignal.asReadonly();
  paginationFilter = this.auditPaginationFilter.asReadonly();

  filters = this.filtersSignal.asReadonly();

  constructor(
    private http:HttpClient,
    private dimensionsService:DimensionsService,
    private resourceService:ResourceService
  ) {
    // this.loadMockData();
  }
  getAllFiltersDropDowns(){
    const dimensionLookups$ = this.dimensionsService.getdiminsionLookup();
    const auditOwners$ = this.resourceService.getUsersLookUp();
    const auditCategories$ = this.getAllCategories();
    const auditFrequencies$ = this.getAllFrequencies();
    const auditEntities$ = this.getAllEntities();
    const auditRisks$ = this.getAllRisks();

    return combineLatest({dimensionLookups$, auditOwners$,auditCategories$,auditFrequencies$,auditEntities$,auditRisks$}).pipe(
      map( res =>{
            this.ownerOptions.set(res.auditOwners$)
            this.dimensionOptions.set(res.dimensionLookups$)
            this.categoryOptions.set(res.auditCategories$)
            this.frequencyOptions.set(res.auditFrequencies$)
            this.entityOptions.set(res.auditEntities$)
            this.risksOptions.set(res.auditRisks$)
      }
    )
  )
}
getAllRisks():Observable<RiskItem[]> {
  return this.http
    .get<RiskResponse>(`${this.baseUrl}/Risks/Lookup`)
    .pipe(map((res) => res.data.items));
}
  getAllCategories():Observable<AuditCategory[]>{
    return this.http
          .get<AuditCategories<PaginatedData<AuditCategory>>>(
            `${this.baseUrl}/AuditCategories/lookup`,       
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
      .pipe(map(res => res.data.items));
  }
  getAllFrequencies():Observable<FrequencyData[]>{
    return this.http
          .get<FrequencyResponse>(
            `${this.baseUrl}/AuditFrequencies/lookup`,           
          )
          .pipe(map((res) => res.data));
  }
  getAllEntities():Observable<EntitiesItem[]>{
    return this.http
          .get<EntitiesResponse>(
            `${this.baseUrl}/Entities/lookup`,           
          )
          .pipe(map((res) => res.data));
  }

  // commented untill get backend support
  // getAllEntities():Observable<[]>{
  //   return this.http
  //         .get<<<>>>(
  //           `${this.baseUrl}/AuditItems/GetAuditOverviewEntityAuditItem`,            
  //         )
  //         .pipe(map((res) => res.data.items));
  // }
getTableData(filters:Object): Observable<AuditItem[]> {
  
  let params = new HttpParams();

  // Loop through each filter key and append valid ones
  Object.entries(filters).forEach(([key, value]) => {
    
      
      params = params.set(key, value.toString());
    
  });
  
  return this.http
    .get<AuditItemsResponse>(`${this.baseUrl}/AuditItems/GetList`, { params })
    .pipe(
      map((res) => {
        
        const items = (res.data?.items ?? []).map((item) => ({
          ...item,
          action: true,
        }));
        
        this.auditItemsSignal.set(items);
        return items;
      })
    );
}

 

  updateFilters(filters: any) {
    
    this.filtersSignal.update(current => ({ ...current, ...filters }));
    console.log("this.filtersSignal",this.filtersSignal());
    
  }

  resetFilters() {
    this.filtersSignal.set({});
  }
  public resetAllSignals(): void {
  const defaultValues: Record<string, any> = {
    auditItemsSignal: [],
    auditHeaderSignal: [
      { header: 'Risk Code', field: 'code' },
      { header: 'Audit item', field: 'title' },
      { header: 'Dimension', field: 'dimensionName' },
      { header: 'Entity', field: 'entityName' },
      { header: 'Audit Category', field: 'auditCategoryName' },
      { header: 'Estimated effort', field: 'estimatedEffort' },
      { header: 'Status', field: 'status' },
      { header: 'Priority level', field: 'priority' },
      { header: 'Audit Frequency', field: 'auditFrequencyName' },
      { header: 'Audit Owner', field: 'auditOwnerName' },
      { header: 'Action', field: 'action' }
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

createAuditItem(payload: Partial<AddauditItem>): Observable<AddauditItemResponse> {
    return this.http
      .post<AddauditItemResponse>(`${this.baseUrl}/AuditItems`, payload)     
  }
editAuditItem(payload: Partial<AddauditItem>,id:string): Observable<AddauditItemResponse> {
    return this.http
      .put<AddauditItemResponse>(`${this.baseUrl}/AuditItems/${id}`, payload)     
  }
getAuditItemById(id: string): Observable<AddauditItemViewModel> {
  return this.http
    .get<AddauditItemResponse>(`${this.baseUrl}/AuditItems/${id}`)
    .pipe(
      map(res => {
        const item = res.data;

        // ✅ Convert risks and riskIds to string (comma-separated or empty string)
        const risksString = item.risks?.map(r => r.riskId).join(', ') || '';
        const riskIdsString = item.riskIds?.join(', ') || '';

        return {
          ...item,
          risks: risksString,
          riskIds: riskIdsString
        };
      })
    );
}

}
