import { Component, inject, Input, ViewChild } from "@angular/core";
import { OrganizationStrategy } from "../../services/organization-strategy";
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
import { Strategy } from "../../models/strategy";
import { MessageService } from "primeng/api";
import { deleteItemInterface } from "../../../../shared/components/delete-item-selected/models/delete-item.interface";

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
export class List {
  @Input() filters: Record<string, any> = {};
  private strategyService = inject(OrganizationStrategy);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private config = inject(NgbModalConfig);
  private messageService = inject(MessageService);
  @ViewChild("content", { static: false }) content: any;
  selectedDeletedStrategyId!: number;
  selectedArchivedStrategyId!: number;
  orgId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orgId = toSignal(this.orgId$, { initialValue: null });

  columns: any[] = [
    {
      field: "organizationName",
      header: "Organization Name",
    },
    {
      field: "code",
      header: "Code",
    },
    {
      field: "year",
      header: "Year",
    },
    {
      field: "vision",
      header: "Vision",
    },
    { field: "actions", header: "Actions" },
  ];
  pagination: any = {
    pageNumber: 1,
    pageSize: 10,
  };

  strategiesList: Strategy[] = [];
  viewData: deleteItemInterface = { title: "", sendLabel: "", sendClose: "" };

  constructor() {
    this.config.backdrop = "static";
    this.config.keyboard = false;
  }

  ngOnInit() {
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
      .getStrategies({ ...filterPayload, organizationId: this.orgId() })
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
    this.selectedDeletedStrategyId = id;
    this.viewData = {
      title: "Delete Strategy",
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }

  openArchived(data: Strategy) {
    this.selectedArchivedStrategyId = data.id;
    this.viewData = {
      title: `Archived “${data.organizationName}”`,
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
      this.strategyService
        .deleteStrategy(this.selectedDeletedStrategyId)
        .pipe(
          tap(() => {
            this.loadStrategies(this.pagination);
          })
        )
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
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
        .pipe(
          tap(() => {
            this.loadStrategies(this.pagination);
          })
        )
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
