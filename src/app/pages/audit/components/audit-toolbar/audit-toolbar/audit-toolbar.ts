import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuditItemService } from '../../../services/auditItem/audit-item-service';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-audit-toolbar',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, RouterLink, RouterLinkActive],
  templateUrl: './audit-toolbar.html',
  styleUrl: './audit-toolbar.scss'
})
export class AuditToolbar implements OnInit{

  searchSubject:Subject<string> = new Subject()

  constructor(public auditService:AuditItemService,private destroyRef:DestroyRef){}
  ngOnInit(): void {
    this.searchSubject.pipe(
            debounceTime(1000),               
            distinctUntilChanged(),          
            switchMap(searchValue => {       
              return this.auditService.getTableData({
                ...this.auditService.pagination(),
                title: searchValue ?? ''
              });
            }),
            takeUntilDestroyed(this.destroyRef)
          ).subscribe()
  }
  searchTitle(event:string){
    this.searchSubject.next(event)
  }
  
 
}
