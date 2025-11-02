import { Component, DestroyRef, isSignal, OnDestroy, OnInit, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { AuditItem, FilterOption } from '../../../models/interfaces/audit-item';
import { AuditItemService } from '../../../services/auditItem/audit-item-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { lookup } from '../../../../../shared/models/lookup.mdoel';
import { AuditCategory } from '../../../models/interfaces/audit-categories';
import { FrequencyData } from '../../../models/interfaces/audit-frequancy';
import { EntitiesItem } from '../../../models/interfaces/audit-entities';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-audit-filter',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule,SelectModule],
  templateUrl: './audit-filter.html',
  styleUrl: './audit-filter.scss'
})
export class AuditFilter implements OnInit,OnDestroy {
  @ViewChildren('filterSelect') allSelects!: QueryList<Select>;
  searchText = '';
  
  // dimensionOptions = signal<AuditItem[]>([]);
  
  // entityOptions = signal<EntitiesItem[]>([]);
  
  // categoryOptions = signal<AuditCategory[]>([]);
  
  statusOptions = signal<FilterOption[]>([
    { label: 'New', value: '0' },
    { label: 'Approved', value: '1' },
    { label: 'Rejected', value: '2' },
    { label: 'Reviewed', value: '3' },
    { label: 'Sent', value: '4' }
  ]);
  
  priorityOptions = signal<FilterOption[]>([
    { label: 'High', value: '0' },
    { label: 'Medium', value: '1' },
    { label: 'Low', value: '2' }
  ]);
  

  constructor(public auditService: AuditItemService) {}
  
  ngOnInit(): void {
    this.getDropdownsValues()
    
  }
getDropdownsValues(){

  this.auditService.getAllFiltersDropDowns().subscribe()
}
  onApply() {
    this.auditService.getTableData(this.auditService.filters()).subscribe()
  }
  updateFilters(filterKey:string,value:string){
    
    this.auditService.updateFilters({[filterKey]:value})
  }
  onReset() {
    
    this.allSelects.forEach(select => select.clear());
    this.auditService.resetFilters();
    this.searchText = '';
    this.auditService.getTableData({}).subscribe()

  }

  onCancel() {
    console.log('Cancel filters');
  }
 

  ngOnDestroy(): void {
    
    this.auditService.resetFilters()
    this.auditService.resetAllSignals()
  }
}
