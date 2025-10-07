import { Component, inject, Input, ViewChild } from "@angular/core";
import { Entity } from "../../services/entity";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { toSignal } from "@angular/core/rxjs-interop";
import { tap } from "rxjs";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { EntityInterface } from "../../models/entity";
import { SlicePipe } from "@angular/common";
import { appRoutes } from "../../../../app.routes.enum";

@Component({
  selector: "app-board",
  imports: [
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    CustomPaginatorComponent,
    SlicePipe,
  ],
  templateUrl: "./board.html",
  styleUrl: "./board.scss",
})
export class Board {
  @Input() filters: Record<string, any> = {};

  private entityService = inject(Entity);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  @ViewChild("content", { static: false }) content: any;

  entitiesList: EntityInterface[] = [];
  selectedEntityId!: number;
  selectedArchivedEntityId!: number;

  viewData: deleteItemInterface = { title: "", sendClose: "", sendLabel: "" };

  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

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

  openArchive(entity: any) {
    this.selectedArchivedEntityId = entity.id;
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
    if (this.viewData.title.includes("Delete")) {
      this.entityService
        .deleteEntity(this.selectedEntityId)
        .pipe(tap(() => this.loadEntities(this.pagination)))
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
          },
        });
    } else if (this.viewData.title.includes("Archive")) {
      this.entityService
        .archive(this.selectedArchivedEntityId)
        .pipe(tap(() => this.loadEntities(this.pagination)))
        .subscribe({
          next: () => {
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

  navigateToKeyProcess(id: number) {
    this.router.navigate([id, `${appRoutes["KEY-PROCESS"]}`], {
      relativeTo: this.route,
    });
  }
}
