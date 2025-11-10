import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import { WeekEndInterface } from "../../models/resources-unutilized-time";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { WeekEndPopup } from "../week-end-popup/week-end-popup";
import { tap } from "rxjs";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { WeekEndService } from "../../services/week-end-service";

@Component({
  selector: "app-week-end",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./week-end.html",
  styleUrl: "./week-end.scss",
})
export class WeekEnd {
  activeTab = input.required<number>();
  private service = inject(WeekEndService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  // References to child lists
  @ViewChild("weekEndList") weekEndList!: GeneralList<WeekEndInterface>;

  // -------- Filteration configs --------
  weekEndFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Week Ends" },
    import: false,
  };

  // -------- Actions configs --------
  weekEndActions: ShowActions = {
    add: { show: true, label: "New Weekend Day", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  weekEndColumns: {
    field: keyof WeekEndInterface | "actions";
    header: string;
  }[] = [
    { field: "code", header: "Code" },
    { field: "day", header: "Day" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  weekEndFilters: Record<string, any> = {};

  // -------- Fetch functions (typed) --------
  fetchWeekends = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}): ReturnType<WeekEndService["getList"]> =>
    this.service.getList({ pageNumber, pageSize, ...filters });

  // -------- Handle filter changes from header --------
  onFiltersChange(filters: Record<string, any>) {
    this.weekEndFilters = { ...filters };
    this.weekEndList.loadData(this.weekEndList.pagination, this.weekEndFilters);
  }

  // -------- Add actions --------
  onAddWeekend() {
    const ref = this.dialogService.open(WeekEndPopup, {
      header: "Add Weekend",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.weekEndList.loadData(
          this.weekEndList.pagination,
          this.weekEndFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Weekend added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit actions --------
  onEditWeekend(weekend: WeekEndInterface) {
    const ref = this.dialogService.open(WeekEndPopup, {
      header: "Edit Weekend",
      width: "600px",
      modal: true,
      data: weekend,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.weekEndList.loadData(
          this.weekEndList.pagination,
          this.weekEndFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Weekend updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete actions --------
  onDeleteWeekend(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.weekEndList.loadData(
            this.weekEndList.pagination,
            this.weekEndFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Weekend deleted successfully 🎉",
        })
      );
  }

  // -------- Archive actions --------
  onArchiveWeekend(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.weekEndList.loadData(
            this.weekEndList.pagination,
            this.weekEndFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Weekend archived successfully.",
        })
      );
  }
}
