import { Component, effect, inject, OnInit, untracked } from "@angular/core";
import { AuditToolbar } from "../../components/audit-toolbar/audit-toolbar/audit-toolbar";
import { AuditTable } from "../../components/audit-table/audit-table";
import { AuditFilter } from "../../components/audit-filter/audit-filter/audit-filter";
import { AudtiFrequanciesToolbar } from "../../components/audti-frequancies-toolbar/audti-frequancies-toolbar";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { DialogService } from "primeng/dynamicdialog";
import { MessageRequest } from "../../components/dialogs/message-request/message-request";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { AddAuditFrequencyDialog } from "../../components/dialogs/add-audit-frequency-dialog/add-audit-frequency-dialog";

@Component({
  selector: "app-audit-frequency",
  imports: [
    CommonModule,
    AudtiFrequanciesToolbar,
    AuditTable,
    AuditTable,
    NgbDropdownModule,
    RouterModule,
  ],
  providers: [DialogService],
  templateUrl: "./audit-frequency.html",
  styleUrl: "./audit-frequency.scss",
})
export class AuditFrequency implements OnInit {
  private auditService = inject(AuditItemService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  constructor() {
    effect(() => {
      const pagination = untracked(() => this.auditService.pagination());

      this.auditService.getAuditCategoriestFrequency(pagination).subscribe();
    });
  }
  ngOnInit(): void {
    this.auditService
      .getAuditCategoriestFrequency(this.auditService.pagination())
      .subscribe();
  }
  deleteAuditItem(id: string, title: string) {
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
        this.auditService.deleteFrequencyAuditItem(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            ref.close();
            this.auditService
              .getAuditCategoriestFrequency(this.auditService.pagination())
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

  EditAuditItem(
    id: string,
    name: string,
    describtion: string,
    riskratingId: number
  ) {
    const ref = this.dialogService.open(AddAuditFrequencyDialog, {
      header: "Add Audit Frequancy",
      width: "600px",
      modal: true,
      data: {
        name: name,
        describtion: describtion,
        riskratingId: riskratingId,
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.auditService
          .editAuditFrequancy({ ...result, id: id }, id)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.auditService
                .getAuditCategoriestFrequency(this.auditService.pagination())
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
