import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { map, tap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "../../shared/components/header/header.component";
import { GeneralList } from "../../shared/components/general-list/general-list";
import { RiskRootCausesService } from "./services/risk-root-causes";
import { RiskRootCauseInterface } from "./models/risk-root-causes";
import {
  ShowActions,
  ShowFilteration,
} from "../../shared/components/header/models/header.interface";
import { RiskRootCausePopup } from "./components/rist-root-causes-popup/risk-root-causes-popup";

@Component({
  selector: "app-risk-root-causes",
  imports: [HeaderComponent, GeneralList],
  providers: [DialogService],
  templateUrl: "./risk-root-causes.html",
  styleUrl: "./risk-root-causes.scss",
})
export class RiskRootCauses {
  activeTab = input.required<number>();
  private service = inject(RiskRootCausesService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("rootCausesList")
  rootCausesList!: GeneralList<RiskRootCauseInterface>;

  // -------- Filteration configs --------
  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Root Causes" },
    import: false,
  };

  // -------- Actions configs --------
  actions: ShowActions = {
    add: { show: true, label: "New Root Cause", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  columns: {
    field: keyof RiskRootCauseInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "rootCause", header: "Root Cause" },
    { field: "parent", header: "Parent" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  filters: Record<string, any> = {};

  // -------- Fetch function --------
  fetchData = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
  } = {}) =>
    this.service.getList({
      pageNumber,
      pageSize,
      ...filters,
    });

  // -------- Handle filter changes --------
  onFiltersChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    this.rootCausesList.loadData(this.rootCausesList.pagination, this.filters);
  }

  // -------- Add --------
  onAdd() {
    const ref = this.dialogService.open(RiskRootCausePopup, {
      header: "Add Root Cause",
      width: "700px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) this.reloadList();
    });
  }

  // -------- Edit --------
  onEdit(row: RiskRootCauseInterface) {
    const ref = this.dialogService.open(RiskRootCausePopup, {
      header: "Edit Root Cause",
      width: "700px",
      modal: true,
      data: row,
    });

    ref?.onClose.subscribe((result) => {
      if (result) this.reloadList();
    });
  }

  // -------- Delete --------
  onDelete(id: number) {
    this.service
      .delete(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Root cause deleted successfully 🗑️",
        })
      );
  }

  private reloadList() {
    this.rootCausesList.loadData(this.rootCausesList.pagination, this.filters);
  }
}
