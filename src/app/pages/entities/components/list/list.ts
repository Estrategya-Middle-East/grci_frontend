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
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { Entity } from "../../services/entity";
import { EntityInterface } from "../../models/entity";
import { MessageService } from "primeng/api";

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
  private entityService = inject(Entity);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;
  selectedEntityId!: number;
  selectedArchiveEntityId!: number;

  columns: any[] = [
    { field: "name", header: "Entity" },
    { field: "dimensionTitle", header: "Dimension" },
    { field: "orgChartLevelName", header: "Org Chart Level" },
    { field: "organizationTitle", header: "Organization Unit Name" },
    { field: "actions", header: "Actions" },
  ];

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  entitiesList: EntityInterface[] = [];
  viewData: any = {};

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadEntities(this.pagination);
  }

  loadEntities(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };
    this.entityService.getEntities(filterPayload).subscribe({
      next: (response) => {
        this.entitiesList = response.items;
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
    this.selectedEntityId = id;
    this.viewData = {
      title: "Delete Entity",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(entity: EntityInterface) {
    this.selectedArchiveEntityId = entity.id;
    this.viewData = {
      title: `Archive “${entity.name}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.entityService
        .deleteEntity(this.selectedEntityId)
        .pipe(tap(() => this.loadEntities(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Entity Deleted successfully 🎉",
            });
            this.modalService.dismissAll();
          },
        });
    } else if (this.viewData?.title?.includes("Archive")) {
      this.entityService
        .archive(this.selectedArchiveEntityId)
        .pipe(tap(() => this.loadEntities(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Strategy has been archived successfully.",
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
