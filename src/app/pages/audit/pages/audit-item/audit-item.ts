import { Component, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { AuditToolbar } from "../../components/audit-toolbar/audit-toolbar/audit-toolbar";
import { AuditFilter } from "../../components/audit-filter/audit-filter/audit-filter";
import { AuditTable } from "../../components/audit-table/audit-table";
import { List } from "../../../control-management/components/list/list";
import { AuditItemService } from '../../services/auditItem/audit-item-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageRequest } from '../../components/dialogs/message-request/message-request';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-audit-item',
  imports: [AuditToolbar, AuditFilter, AuditTable,NgbDropdownModule,RouterModule],
 providers:[DialogService],
  templateUrl: './audit-item.html',
  styleUrl: './audit-item.scss'
})
export class AuditItem implements OnInit{
  constructor(public auditService:AuditItemService){
    effect(()=>{
      const pagination = untracked(() => this.auditService.pagination());

      this.auditService.getTableData(pagination).subscribe()
    })
  }
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  ngOnInit(): void {
    this.auditService.getTableData(this.auditService.pagination()).subscribe()
  }
  deleteAuditItem(id:string,title:string) {
      const ref = this.dialogService.open(MessageRequest, {
       header: ' ', // Empty space to show the close button, or remove for no header
          width: '600px',
          height:'370px',
          modal: true, // This adds the backdrop
          dismissableMask: false, // Prevents closing when clicking outside
          closable: false, // Remove the X button if you want
          data: {
            itemName: title // Pass the item name to display
          }
      });
      
      ref.onClose.subscribe((result) => {
        if (result) {
          this.auditService.deleteAuditItem(id).subscribe({
            next:(res)=>{
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              ref.close()
              this.auditService.getTableData({}).subscribe()
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
