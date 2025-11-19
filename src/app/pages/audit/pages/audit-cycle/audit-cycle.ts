import { Component, effect, inject, untracked } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink, RouterModule } from "@angular/router";
import { map } from "rxjs";
import {
  ShowActions,
  DropdownList,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { AuditCycleToolbar } from "../../components/audit-cycle-toolbar/audit-cycle-toolbar";
import { AuditTable } from "../../components/audit-table/audit-table";
import { Board } from "../../../organization-strategy/components/board/board";
import { AuditcycleBoard } from "../../components/auditcycle-board/auditcycle-board";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogService } from "primeng/dynamicdialog";
import { HttpErrorResponse } from "@angular/common/http";
import { AddAuditFrequencyDialog } from "../../components/dialogs/add-audit-frequency-dialog/add-audit-frequency-dialog";
import { MessageRequest } from "../../components/dialogs/message-request/message-request";
import { MessageService } from "primeng/api";
import { AuditCycleService } from "../../services/auditCycle/audit-cycle";
import { AuditItemService } from "../../services/auditItem/audit-item-service";

@Component({
  selector: "app-audit-cycle",
  imports: [
    HeaderComponent,
    AuditCycleToolbar,
    AuditTable,
    AuditcycleBoard,
    NgbDropdownModule,
    RouterModule,
  ],
  providers: [DialogService],
  templateUrl: "./audit-cycle.html",
  styleUrl: "./audit-cycle.scss",
})
export class AuditCycle {
  private route = inject(ActivatedRoute);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private auditCycleService = inject(AuditCycleService);
  private auditService = inject(AuditItemService);
  switchView = true;
  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });
  filters: Record<string, any> = {};
  showActions: ShowActions = {
    add: {
      show: true,
      label: "New Audit Cycle",
      link: "/audit/cycle/add",
    },
    import: {
      show: true,
      label: "Import Audit Cycle",
    },
  };

  dropdownList: DropdownList[] = [
    {
      label: "Title",
      searchType: "Type",
      optionLabel: "name",
      list: [{ name: "Audit Cycle", value: 2 }],
      selected: "",
    },
  ];

  showFilteration: ShowFilteration = {
    tabeOne: {
      show: true,
      label: "Board View",
    },
    tabeTwo: {
      show: true,
      label: "List View",
    },
    search: {
      show: true,
      label: "Search Audit Cycle",
    },
    dateFromTo: {
      show: true,
      label: "Date From To",
    },
    import: true,
  };
  initialized: boolean = false;
  constructor() {
    effect(() => {
      const pagination = this.auditService.pagination();

      // ✅ Skip first run to prevent unwanted auto-load
      if (!this.initialized) {
        this.initialized = true;
        this.loadAuditCycles();
        return;
      }

      // ✅ Reactively load when pagination changes (page, size)
      this.loadAuditCycles();
    });
  }
  switchview(event: boolean) {
    this.switchView = event;
  }

  onFiltersChange(filters: Record<string, any>) {
    this.filters = filters;
  }
  loadAuditCycles() {
    this.auditCycleService
      .getAuditCycles({
        pageNumber: this.auditService.pagination().pageNumber,
        pageSize: this.auditService.pagination().pageSize,
      })
      .subscribe({
        next: (res: any) => {
          const totalItems = res.data.totalItems ?? 0;
          const current = this.auditService.totalItems();

          // ✅ Prevent effect loop using untracked()
          if (current !== totalItems) {
            untracked(() => {
              this.auditService.totalItems.set(totalItems);
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
