import { Component, inject, signal, untracked } from "@angular/core";
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { AuditCycleService } from "../../services/auditCycle/audit-cycle";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { AuditCycle, PagedResponse } from "../../models/interfaces/audit-cycle";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, map } from "rxjs";
import {
  AuditItem,
  AuditItemsResponse,
} from "../../models/interfaces/audit-item";

import { MessageService } from "primeng/api";
import { RouterModule } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";
import { MessageRequest } from "../dialogs/message-request/message-request";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-auditcycle-board",
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    MessageModule,
    FormsModule,
    RouterModule,
    NgbDropdownModule,
  ],
  providers: [DialogService],
  templateUrl: "./auditcycle-board.html",
  styleUrl: "./auditcycle-board.scss",
})
export class AuditcycleBoard {
  public auditCycleService = inject(AuditCycleService);
  private readonly auditService = inject(AuditItemService);
  private dialogService = inject(DialogService);
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  first = signal(0);
  rows = signal(10);

  ngOnInit() {
    this.loadAuditCycles();
  }

  loadAuditCycles() {
    const pageNumber = Math.floor(this.first() / this.rows()) + 1;

    this.auditCycleService
      .getAuditCycles({
        pageNumber,
        pageSize: this.rows(),
      })
      .subscribe({
        next: (res: any) => {
          this.auditCycleService.auditCycles.set(res.data.items);
          this.auditCycleService.totalRecords.set(res.data.totalItems);
          const totalItems = res.data.totalItems ?? 0;
          const current = this.auditService.totalItems();

          // ✅ Prevent effect loop using untracked()
          if (current !== totalItems) {
            untracked(() => {
              this.auditService.pagination.set(totalItems);
            });
          }
          const items = (res.data.items ?? []).map((item: any) => ({
            ...item,
            YearsRange: item.startDate + " - " + item.endDate,
            action: true,
          }));

          this.auditService.auditItemsSignal.set(items);
          this.auditService.auditHeaderSignal.set([
            { header: "Code", field: "code" },
            { header: "Title", field: "title" },
            { header: "Years Range", field: "yearRange" },
            { header: "Objectives", field: "auditObjectives" },
            { header: "Scope", field: "auditScope" },
            { header: "Strategic Framework", field: "strategicFramework" },
            { header: "Action", field: "action" },
          ]);
        },
        error: (err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: err.error.error[0],
          });
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadAuditCycles();
  }

  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.getFullYear()} - ${end.getFullYear()}`;
  }

  onView(id: number) {
    console.log("View audit cycle:", id);
  }

  onEye(id: number) {
    console.log("Quick view audit cycle:", id);
  }

  onMore(id: number) {
    console.log("More options for audit cycle:", id);
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
        this.auditCycleService.deleteAuditCycle(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.loadAuditCycles();
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
