import { Component, inject, Input, OnChanges, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { map, tap } from "rxjs";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { ToastModule } from "primeng/toast";
import { toSignal } from "@angular/core/rxjs-interop";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { MessageService } from "primeng/api";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { EntitiesKeyProcessService } from "../../services/entities-key-process-service";
import { ProcessManagement } from "../../models/key-process/key-process";

@Component({
  selector: "app-list",
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
  private processService = inject(EntitiesKeyProcessService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);
  @ViewChild("content", { static: false }) content: any;

  selectedDeletedProcessId!: number;
  selectedArchivedProcessId!: number;
  entityId$ = this.route.paramMap.pipe(map((params) => params.get("entityId")));
  entityId = toSignal(this.entityId$, { initialValue: null });

  columns: any[] = [
    { field: "name", header: "Process Name" },
    { field: "description", header: "Description" },
    { field: "processOwnerName", header: "Owner" },
    { field: "entityName", header: "Entity" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  processesList: ProcessManagement[] = [];
  viewData: deleteItemInterface = { title: "", sendLabel: "", sendClose: "" };

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadProcesses(this.pagination);
  }

  loadProcesses(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };

    this.processService
      .getProcessManagements({ ...filterPayload, entityId: this.entityId() })
      .subscribe({
        next: (response) => {
          this.processesList = response.items;
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
    this.selectedDeletedProcessId = id;
    this.viewData = {
      title: "Delete Key Process",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchived(data: ProcessManagement) {
    this.selectedArchivedProcessId = data.id;
    this.viewData = {
      title: `Archive “${data.name}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content);
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.processService
        .deleteProcessManagement(this.selectedDeletedProcessId)
        .pipe(tap(() => this.loadProcesses(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Key Process deleted successfully 🎉",
            });
            this.modalService.dismissAll();
          },
        });
    } else {
      this.processService
        .archive(this.selectedArchivedProcessId)
        .pipe(tap(() => this.loadProcesses(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Key Process archived successfully.",
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
