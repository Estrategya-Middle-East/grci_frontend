import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { ImpactPopup } from "../impact-popup/impact-popup";
import { tap } from "rxjs";
import { ImpactService } from "../../services/impact-service";
import { ImpactInterface } from "../../models/risk-scoring";

@Component({
  selector: "app-impact",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./impact.html",
  styleUrl: "./impact.scss",
})
export class Impact {
  activeTab = input.required<number>();
  private service = inject(ImpactService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("impactList") impactList!: GeneralList<ImpactInterface>;

  // -------- Filteration configs --------
  impactFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Impacts" },
    import: false,
  };

  // -------- Actions configs --------
  impactActions: ShowActions = {
    add: { show: true, label: "New Impact", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  impactColumns: {
    field: keyof ImpactInterface | "actions";
    header: string;
  }[] = [
    { field: "code", header: "Code" },
    { field: "title", header: "Impact Scale Name" },
    { field: "value", header: "Value" },
    { field: "actions", header: "Actions" },
  ];

  impactFilters: Record<string, any> = {};

  // -------- Fetch --------
  fetchImpacts = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) => this.service.getList({ pageNumber, pageSize, ...filters });

  // -------- Filter Change --------
  onFiltersChange(filters: Record<string, any>) {
    this.impactFilters = { ...filters };
    this.impactList.loadData(this.impactList.pagination, this.impactFilters);
  }

  // -------- Add --------
  onAddImpact() {
    const ref = this.dialogService.open(ImpactPopup, {
      header: "Add Impact",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.impactList.loadData(
          this.impactList.pagination,
          this.impactFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Impact added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditImpact(impact: ImpactInterface) {
    const ref = this.dialogService.open(ImpactPopup, {
      header: "Edit Impact",
      width: "600px",
      modal: true,
      data: impact,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.impactList.loadData(
          this.impactList.pagination,
          this.impactFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Impact updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteImpact(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.impactList.loadData(
            this.impactList.pagination,
            this.impactFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Impact deleted successfully 🎉",
        })
      );
  }

  // -------- Archive --------
  onArchiveImpact(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.impactList.loadData(
            this.impactList.pagination,
            this.impactFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Impact archived successfully.",
        })
      );
  }
}
