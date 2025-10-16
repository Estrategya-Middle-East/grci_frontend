import { Component, inject, Input, OnChanges, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { tap } from "rxjs";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ToastModule } from "primeng/toast";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { MessageService } from "primeng/api";
import { Control } from "../../models/control-management";
import { ControlManagementService } from "../../services/control-management";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    ToastModule,
    CustomPaginatorComponent,
  ],
  templateUrl: "./list.html",
  styleUrl: "./list.scss",
})
export class List implements OnChanges {
  @Input() filters: Record<string, any> = {};

  private service = inject(ControlManagementService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;
  selectedControlId!: number;
  selectedArchiveControlId!: number;

  columns = [
    { field: "name", header: "Control Name" },
    { field: "controlCategoryName", header: "Control Category" },
    { field: "controlSignificanceName", header: "Control Significance" },
    { field: "controlAutomationName", header: "Control Automation" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  controls: Control[] = [];
  viewData: any = {};

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

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

    this.service.getControls(filterPayload).subscribe({
      next: (response) => {
        this.controls = response.items.map((ctrl) => ({
          ...ctrl,
          statusLabel: ctrl.status === 1 ? "Active" : "Draft",
        }));

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
      sendLabel: "Confirm Deletion",
      sendClose: "Cancel",
      action: "delete",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(control: Control) {
    this.selectedArchiveControlId = control.id;
    this.viewData = {
      title: `Archive “${control.name}”`,
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
      this.service
        .deleteControl(this.selectedControlId)
        .pipe(tap(() => this.loadControls(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Control deleted successfully.",
            });
            this.modalService.dismissAll();
          },
        });
    } else if (this.viewData.action === "archive") {
      this.service
        .archive(this.selectedArchiveControlId)
        .pipe(tap(() => this.loadControls(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Control archived successfully.",
            });
            this.modalService.dismissAll();
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
}
