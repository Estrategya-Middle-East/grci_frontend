import { Component, Input, OnChanges, ViewChild, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { map, tap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { ControlManagementService } from "../../services/control-management";
import { Control } from "../../models/control-management";

@Component({
  selector: "app-board",
  standalone: true,
  imports: [
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    CustomPaginatorComponent,
    ToastModule,
  ],
  templateUrl: "./board.html",
  styleUrl: "./board.scss",
})
export class Board implements OnChanges {
  @Input() filters: Record<string, any> = {};

  private controlService = inject(ControlManagementService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  controls: Control[] = [];
  selectedControlId!: number;
  viewData: deleteItemInterface & { action?: "delete" | "archive" } = {
    title: "",
    sendClose: "",
    sendLabel: "",
  };

  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadControls(this.pagination);
  }

  loadControls(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };

    this.controlService.getControls(filterPayload).subscribe({
      next: (response) => {
        this.controls = response.items;
        this.pagination = {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        };
      },
    });
  }

  openDelete(id: number) {
    this.selectedControlId = id;
    this.viewData = {
      title: "Delete Control",
      sendLabel: "Delete",
      sendClose: "Cancel",
      action: "delete",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(id: number) {
    this.selectedControlId = id;
    this.viewData = {
      title: "Archive Control",
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
      action: "archive",
    };
    this.modalService.open(this.content, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData.action === "delete") {
      this.controlService
        .deleteControl(this.selectedControlId)
        .pipe(tap(() => this.loadControls(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Control deleted successfully",
            });
            this.modalService.dismissAll();
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete control",
            });
          },
        });
    } else if (this.viewData.action === "archive") {
      this.controlService
        .archive(this.selectedControlId)
        .pipe(tap(() => this.loadControls(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Control archived successfully",
            });
            this.modalService.dismissAll();
          },
          error: () => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to archive control",
            });
          },
        });
    }
  }

  navigateToEdit(id: number) {
    this.router.navigate(["edit", id], { relativeTo: this.route });
  }

  navigateToView(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
}
