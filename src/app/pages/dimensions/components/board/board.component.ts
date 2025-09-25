import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { DimensionsService } from "../../services/dimensions.service";
import { Dimension, DimensionsFilter } from "../../models";
import { Router } from "@angular/router";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { tap } from "rxjs";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";

@Component({
  selector: "app-board",
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    CustomPaginatorComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent {
  private dimensionsService = inject(DimensionsService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);

  @ViewChild("content", { static: false }) content: any;

  dimensionsList: Dimension[] = [];
  selectedDimensionId!: number;
  viewData: deleteItemInterface = { title: "", sendClose: "", sendLabel: "" };

  pagination: DimensionsFilter = {
    pageNumber: 1,
    pageSize: 10,
  };

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnInit() {
    this.loadDimensions(this.pagination);
  }

  loadDimensions(pagination: DimensionsFilter) {
    this.dimensionsService.getDimensions(pagination).subscribe({
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
    if (this.viewData.title.includes("Delete")) {
      this.dimensionsService
        .deleteDimension(this.selectedDimensionId)
        .pipe(tap(() => this.loadDimensions(this.pagination)))
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
        .pipe(tap(() => this.loadDimensions(this.pagination)))
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
    this.router.navigateByUrl(`dimensions/${id}`);
  }

  navigateToEdit(id: number) {
    this.router.navigateByUrl(`dimensions/edit/${id}`);
  }
}
