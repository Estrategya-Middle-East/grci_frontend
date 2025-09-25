import { CommonModule } from "@angular/common";
import { Component, inject, Input, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { DimensionsService } from "../../services/dimensions.service";
import { Dimension, DimensionsFilter } from "../../models";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { appRoutes } from "../../../../app.routes.enum";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";

@Component({
  selector: "app-list",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    InputTextModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    ToastModule,
    CustomPaginatorComponent,
  ],
  providers: [MessageService],
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
})
export class ListComponent {
  @Input() filters: Record<string, any> = {};
  private dimensionsService = inject(DimensionsService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  selectedDimensionId!: number;
  pagination: DimensionsFilter = {
    pageNumber: 1,
    pageSize: 10,
  };

  columns: any[] = [
    { field: "code", header: "Code" },
    { field: "title", header: "Dimension" },
    { field: "entityCount", header: "# of Entities" },
    { field: "actions", header: "Actions" },
  ];

  dimensionsList: Dimension[] = [];
  viewData: deleteItemInterface = {
    title: "",
    sendClose: "",
    sendLabel: "",
  };

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadDimensions(this.pagination);
  }

  loadDimensions(pagination: DimensionsFilter) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };
    this.dimensionsService.getDimensions(filterPayload).subscribe({
      next: (response) => {
        this.dimensionsList = response.data.items;
        this.pagination = {
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
        };
      },
    });
  }

  openDelete(id: number) {
    this.selectedDimensionId = id;
    this.viewData = {
      title: "Delete Dimension",
      sendLabel: "Confirm Deletion",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchive(id: number) {
    this.selectedDimensionId = id;
    this.viewData = {
      title: "Archive Dimension",
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
      this.dimensionsService
        .deleteDimension(this.selectedDimensionId)
        .pipe(tap(() => this.loadDimensions({ ...this.pagination })))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Deleted",
              detail: "Dimension has been deleted successfully.",
            });
            this.modalService.dismissAll();
          },
        });
    } else {
      this.dimensionsService
        .archive(this.selectedDimensionId)
        .pipe(tap(() => this.loadDimensions({ ...this.pagination })))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "info",
              summary: "Archived",
              detail: "Dimension has been archived successfully.",
            });
            this.modalService.dismissAll();
          },
        });
    }
  }

  navigateToView(id: number) {
    this.router.navigateByUrl(`${appRoutes.DIMENSIONS}/${id}`);
  }

  navigateToEdit(id: number) {
    this.router.navigateByUrl(`${appRoutes.DIMENSIONS}/edit/${id}`);
  }
}
