import { Component, ViewChild, inject, input } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { ControlSignificancePopup } from "../control-significance-popup/control-significance-popup";
import { tap } from "rxjs";
import { ControlSignificanceService } from "../../services/control-significance";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-control-significance",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./control-significance.html",
  styleUrl: "./control-significance.scss",
})
export class ControlSignificance {
  activeTab = input.required<number>();
  private service = inject(ControlSignificanceService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("significanceList") significanceList!: GeneralList<lookup>;

  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Control Significance" },
    import: false,
  };

  actions: ShowActions = {
    add: { show: true, label: "New Control Significance", isLink: false },
    import: { show: false, label: "" },
  };

  columns: {
    field: keyof lookup | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "name", header: "Control Significance Name" },
    { field: "actions", header: "Actions" },
  ];

  filters: Record<string, any> = {};

  fetchSignificances = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) => this.service.getList({ pageNumber, pageSize, ...filters });

  onFiltersChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    this.significanceList.loadData(
      this.significanceList.pagination,
      this.filters
    );
  }

  onAddSignificance() {
    const ref = this.dialogService.open(ControlSignificancePopup, {
      header: "Add Control Significance",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.significanceList.loadData(
          this.significanceList.pagination,
          this.filters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Significance added successfully 🎉",
        });
      }
    });
  }

  onEditSignificance(item: lookup) {
    const ref = this.dialogService.open(ControlSignificancePopup, {
      header: "Edit Control Significance",
      width: "600px",
      modal: true,
      data: item,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.significanceList.loadData(
          this.significanceList.pagination,
          this.filters
        );
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "Significance updated successfully 🎉",
        });
      }
    });
  }

  onDeleteSignificance(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.significanceList.loadData(
            this.significanceList.pagination,
            this.filters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Significance deleted successfully 🎉",
        })
      );
  }

  onArchiveSignificance(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.significanceList.loadData(
            this.significanceList.pagination,
            this.filters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Significance archived successfully.",
        })
      );
  }
}
