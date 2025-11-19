import { Component, effect, inject, untracked } from "@angular/core";
import { AuditEngagementToolbar } from "../../components/audit-engagement-toolbar/audit-engagement-toolbar";
import { AuditTable } from "../../components/audit-table/audit-table";
import { DialogService } from "primeng/dynamicdialog";
import { HttpErrorResponse } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { AddAuditFrequencyDialog } from "../../components/dialogs/add-audit-frequency-dialog/add-audit-frequency-dialog";
import { MessageRequest } from "../../components/dialogs/message-request/message-request";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { NgbDropdown, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AddEditEngagement } from "../../components/dialogs/add-edit-engagement/add-edit-engagement";

@Component({
  selector: "app-audit-engagement",
  imports: [
    CommonModule,
    AuditTable,
    AuditTable,
    NgbDropdownModule,
    RouterModule,
    AuditEngagementToolbar,
  ],
  providers: [DialogService],
  templateUrl: "./audit-engagement.html",
  styleUrl: "./audit-engagement.scss",
})
export class AuditEngagement {
  private auditService = inject(AuditItemService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  initialized: boolean = false;
  constructor() {
    effect(() => {
      const pagination = this.auditService.pagination();

      // ✅ Skip first run to prevent unwanted auto-load
      if (!this.initialized) {
        this.initialized = true;
        this.auditService.getAuditEngagementList(pagination).subscribe();
        return;
      }

      // ✅ Reactively load when pagination changes (page, size)
      this.auditService.getAuditEngagementList(pagination).subscribe();
    });
  }
  ngOnInit(): void {
    this.auditService
      .getAuditEngagementList(this.auditService.pagination())
      .subscribe();
  }
  deleteAuditEngagementItem(id: string, title: string) {
    const ref = this.dialogService.open(MessageRequest, {
      header: " ", // Empty space to show the close button, or remove for no header
      width: "600px",
      height: "370px",
      modal: true, // This adds the backdrop
      dismissableMask: false, // Prevents closing when clicking outside
      closable: false, // Remove the X button if you want
      data: {
        itemName: title, // Pass the item name to display
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.auditService.deleteEngagementAuditItem(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            ref.close();
            this.auditService
              .getAuditEngagementList(this.auditService.pagination())
              .subscribe();
          },
          error: (err: HttpErrorResponse) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: err.error.error[0],
            });
          },
        });
      }
    });
  }

  EditAuditEngagementItem(id: string, describtion: string) {
    const ref = this.dialogService.open(AddEditEngagement, {
      header: "Add Audit Engagement",
      width: "600px",
      modal: true,
      data: {
        describtion: describtion,
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.auditService
          .EditAuditEngagement({ ...result, id: id }, id)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.auditService
                .getAuditEngagementList(this.auditService.pagination())
                .subscribe();
              this.auditService.getAllCategories().subscribe((res) => {
                this.auditService.categoryOptions.set(res);
              });
            },
            error: (err: HttpErrorResponse) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: err.error.error[0],
              });
            },
          });
      }
    });
  }
}
