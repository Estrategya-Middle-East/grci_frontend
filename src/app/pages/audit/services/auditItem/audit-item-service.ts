import { Injectable, isSignal, signal, WritableSignal } from '@angular/core';
import { AuditItem, AuditFilters, TableColumn, AuditItemsResponse } from '../../models/interfaces/audit-item';
import { DimensionsService } from '../../../dimensions/services/dimensions.service';
import { ResourceService } from '../../../resources-management/services/resource';
import { combineLatest, map, Observable } from 'rxjs';
import { AuditCategories, AuditCategory } from '../../models/interfaces/audit-categories';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {  FrequencyData, FrequencyResponse } from '../../models/interfaces/audit-frequancy';
import { EntitiesItem, EntitiesResponse } from '../../models/interfaces/audit-entities';

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

    return combineLatest({dimensionLookups$, auditOwners$,auditCategories$,auditFrequencies$,auditEntities$});
  }
  getAllCategories():Observable<AuditCategory[]>{
    return this.http
          .get<AuditCategories<AuditCategory>>(
            `${this.baseUrl}/AuditCategories/lookup`,       
          )
          .pipe(map((res) => res.data.items));
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
    
    for (const key of Object.keys(this)) {
      
      const prop = (this as any)[key];

      // ✅ Correct way to check if the property is a signal
      if (isSignal(prop) && 'set' in prop) {
        (prop as WritableSignal<any>).set(null);
      }
    }
  }
  // toggleItemSelection(index: number) {
  //   this.auditItemsSignal.update(items => {
  //     const updated = [...items];
  //     updated[index] = { ...updated[index], selected: !updated[index].selected };
  //     return updated;
  //   });
  // }

  // toggleAllSelection(selected: boolean) {
  //   this.auditItemsSignal.update(items =>
  //     items.map(item => ({ ...item, selected }))
  //   );
  // }
}
