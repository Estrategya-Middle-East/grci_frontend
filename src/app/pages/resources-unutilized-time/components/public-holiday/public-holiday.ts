import { Component, inject, input, ViewChild } from "@angular/core";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import { PublicHolidayInterface } from "../../models/resources-unutilized-time";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { PublicHolidayPopup } from "../public-holiday-popup/public-holiday-popup";
import { tap } from "rxjs";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { PublicHolidayService } from "../../services/public-holiday-service";

@Component({
  selector: "app-public-holiday",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./public-holiday.html",
  styleUrl: "./public-holiday.scss",
})
export class PublicHoliday {
  activeTab = input.required<number>();
  private service = inject(PublicHolidayService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  // References to child lists
  @ViewChild("holidayList") holidayList!: GeneralList<PublicHolidayInterface>;

  // -------- Filteration configs --------
  holidayFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Public Holidays" },
    import: false,
  };

  // -------- Actions configs --------
  holidayActions: ShowActions = {
    add: { show: true, label: "New Holiday", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  publicHolidayColumns: {
    field: keyof PublicHolidayInterface | "actions";
    header: string;
  }[] = [
    { field: "code", header: "Code" },
    { field: "title", header: "Holiday Name" },
    { field: "date", header: "Date" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  holidayFilters: Record<string, any> = {};

  // -------- Fetch functions (typed) --------

  fetchHolidays = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}): ReturnType<PublicHolidayService["getList"]> =>
    this.service.getList({ pageNumber, pageSize, ...filters });

  // -------- Handle filter changes from header --------
  onFiltersChange(filters: Record<string, any>) {
    this.holidayFilters = { ...filters };
    this.holidayList.loadData(this.holidayList.pagination, this.holidayFilters);
  }

  // -------- Add actions --------
  onAddPublicHolidays() {
    const ref = this.dialogService.open(PublicHolidayPopup, {
      header: "Add Public Holiday",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.holidayList.loadData(
          this.holidayList.pagination,
          this.holidayFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Public Holiday added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit actions --------
  onEditHoliday(row: PublicHolidayInterface) {
    const ref = this.dialogService.open(PublicHolidayPopup, {
      header: "Edit Public Holiday",
      width: "600px",
      modal: true,
      data: row,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.holidayList.loadData(
          this.holidayList.pagination,
          this.holidayFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Public holiday updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete actions --------
  onDeleteHoliday(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.holidayList.loadData(
            this.holidayList.pagination,
            this.holidayFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Public Holiday deleted successfully 🎉",
        })
      );
  }

  // -------- Archive actions --------
  onArchiveHoliday(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.holidayList.loadData(
            this.holidayList.pagination,
            this.holidayFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Holiday archived successfully.",
        })
      );
  }
}
