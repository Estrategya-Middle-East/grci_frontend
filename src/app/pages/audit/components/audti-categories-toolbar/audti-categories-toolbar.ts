import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuditItemService } from '../../services/auditItem/audit-item-service';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { AddAuditFrequencyDialog } from '../dialogs/add-audit-frequency-dialog/add-audit-frequency-dialog';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-audti-categories-toolbar',
  imports: [],
  providers:[DialogService],
  templateUrl: './audti-categories-toolbar.html',
  styleUrl: './audti-categories-toolbar.scss'
})
export class AudtiCategoriesToolbar implements OnInit {
  private dialogService = inject(DialogService)
  private messageService = inject(MessageService)
  private searchSubject = new Subject<string>();
constructor(public auditService:AuditItemService,private destroyRef: DestroyRef){}
  ngOnInit(): void {
     this.searchSubject.pipe(
        debounceTime(1000),               
        distinctUntilChanged(),          
        switchMap(searchValue => {       
          return this.auditService.getAuditCategoriestFrequency({
            ...this.auditService.pagination(),
            Name: searchValue ?? ''
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }
  getAuditFrequanciesList(searchValue:string){
    this.searchSubject.next(searchValue)    
  }
  addNewAuditFrequancy() {
        const ref = this.dialogService.open(AddAuditFrequencyDialog, {
          header: "Add Audit Frequancy",
          width: "600px",
          modal: true,
        });
        
        ref.onClose.subscribe((result) => {
          if (result) {
            this.auditService.addAuditFrequancy(result).subscribe({
              next:(res)=>{
  
                this.messageService.add({
                  severity: "success",
                  summary: "Success",
                  detail: res.message,
                });
                this.auditService.getAuditCategoriestFrequency(this.auditService.pagination()).subscribe() 
               this.auditService.getAllCategories().subscribe(
               (res)=>{
                this.auditService.categoryOptions.set(res)
               }
               )
              },error:(err:HttpErrorResponse)=>{
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: err.error.error[0],
                });
                
              }
            })
          }
        });
      }
}
