import { Component, inject, Input, OnChanges, ViewChild } from "@angular/core";
import { OrganizationStrategy } from "../../services/organization-strategy";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";
import { map, tap } from "rxjs";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { Strategy } from "../../models/strategy";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-board",
  imports: [
    NgbDropdownModule,
    DeleteItemSelectedComponent,
    CustomPaginatorComponent,
  ],
  templateUrl: "./board.html",
  styleUrl: "./board.scss",
})
export class Board implements OnChanges {
  @Input() filters: Record<string, any> = {};
  private strategyService = inject(OrganizationStrategy);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  @ViewChild("content", { static: false }) content: any;

  strategiesList: Strategy[] = [];
  selectedStrategyId!: number;
  selectedArchivedStrategyId!: number;

  viewData: deleteItemInterface = { title: "", sendClose: "", sendLabel: "" };
  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });

  pagination: {
    pageNumber: number;
    pageSize: number;
    totalItems?: number;
    totalPages?: number;
  } = {
    pageNumber: 1,
    pageSize: 10,
  };

  ngOnChanges() {
    this.pagination.pageNumber = 1;
    this.loadStrategies(this.pagination);
  }

  loadStrategies(pagination: any) {
    const filterPayload = {
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
      filterField: Object.keys(this.filters),
      filterValue: Object.values(this.filters),
    };
    this.strategyService
      .getStrategies(this.orgId() as string, { ...filterPayload })
      .subscribe({
        next: (response) => {
          this.strategiesList = response.items;
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
    this.selectedStrategyId = id;
    this.viewData = {
      title: "Delete Strategy",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchived(strategy: any) {
    this.selectedArchivedStrategyId = strategy.id;
    this.viewData = {
      title: `Archive “${strategy.organizationName}”`,
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
      this.strategyService
        .deleteStrategy(this.selectedStrategyId)
        .pipe(tap(() => this.loadStrategies(this.pagination)))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Strategy Deleted successfully 🎉",
            });
            this.modalService.dismissAll();
          },
        });
    } else {
      this.strategyService
        .archive(this.selectedArchivedStrategyId)
        .pipe(tap(() => this.loadStrategies(this.pagination)))
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
