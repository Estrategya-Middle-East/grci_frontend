import { HttpErrorResponse } from "@angular/common/http";
import { Component, effect, inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { AddAuditFrequencyDialog } from "../../components/dialogs/add-audit-frequency-dialog/add-audit-frequency-dialog";
import { MessageRequest } from "../../components/dialogs/message-request/message-request";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { AuditCategoriesToolbar } from "../../components/audit-categories-toolbar/audit-categories-toolbar";
import { AuditTable } from "../../components/audit-table/audit-table";
import { RouterModule } from "@angular/router";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { AuditFilter } from "../../components/audit-filter/audit-filter/audit-filter";
import { AuditToolbar } from "../../components/audit-toolbar/audit-toolbar/audit-toolbar";
import { AddDialog } from "../../components/dialogs/add-dialog/add-dialog";

@Component({
  selector: "app-audit-category",
  imports: [
    AuditCategoriesToolbar,
    AuditTable,
    NgbDropdownModule,
    RouterModule,
  ],
  providers: [DialogService],
  templateUrl: "./audit-category.html",
  styleUrl: "./audit-category.scss",
})
export class AuditCategory {
  private auditService = inject(AuditItemService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private initialized = false;

  constructor() {
    effect(() => {
      const pagination = this.auditService.pagination();

      // ✅ Skip first run to prevent unwanted auto-load
      if (!this.initialized) {
        this.initialized = true;
        this.auditService.getAuditCategoriestList(pagination).subscribe();
        return;
      }

      // ✅ Reactively load when pagination changes (page, size)
      this.auditService.getAuditCategoriestList(pagination).subscribe();
    });
  }
  ngOnInit(): void {
    this.auditService
      .getAuditCategoriestList(this.auditService.pagination())
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
        this.auditService.deleteCategoryAuditItem(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            ref.close();
            this.auditService
              .getAuditCategoriestList(this.auditService.pagination())
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
    storageLocationId: number
  ) {
    const ref = this.dialogService.open(AddDialog, {
      header: "Edit Audit Category",
      width: "600px",
      modal: true,
      data: {
        name: name,
        describtion: describtion,
        storageLocationId: storageLocationId,
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result.value) {
        this.auditService
          .editAuditCategory({ ...result.value, id: id }, id)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.auditService
                .getAuditCategoriestList(this.auditService.pagination())
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
}
