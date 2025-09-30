import { Component, inject, ViewChild } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { List } from "../list/list";
import { ResourcesUnutilizedTime } from "../../services/resources-unutilized-time";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { tap } from "rxjs";
import { MessageService } from "primeng/api";
import {
  LeaveDay,
  PublicHoliday,
  WeekEnd,
} from "../../models/resources-unutilized-time";
import { WeekEndPopup } from "../week-end-popup/week-end-popup";
import { DialogService } from "primeng/dynamicdialog";
import { PublicHolidayPopup } from "../public-holiday-popup/public-holiday-popup";
import { LeaveDaysPopup } from "../leave-days-popup/leave-days-popup";

@Component({
  selector: "app-view",
  templateUrl: "./view.html",
  styleUrls: ["./view.scss"],
  providers: [DialogService],
  imports: [TabsModule, List, HeaderComponent],
})
export class View {
  private service = inject(ResourcesUnutilizedTime);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  activeTab = 0;

  // References to child lists
  @ViewChild("weekEndList") weekEndList!: List<WeekEnd>;
  @ViewChild("holidayList") holidayList!: List<PublicHoliday>;
  @ViewChild("leaveDaysList") leaveDaysList!: List<LeaveDay>;

  // -------- Filteration configs --------
  weekEndFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Week Ends" },
    import: false,
  };

  holidayFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Public Holidays" },
    import: false,
  };

  leaveDaysFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Leave Days" },
    import: false,
  };

  // -------- Actions configs --------
  weekEndActions: ShowActions = {
    add: { show: true, label: "New Weekend Day", isLink: false },
    import: { show: false, label: "" },
  };

  holidayActions: ShowActions = {
    add: { show: true, label: "New Holiday", isLink: false },
    import: { show: false, label: "" },
  };

  leaveDaysActions: ShowActions = {
    add: { show: true, label: "New Leave Day", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  weekEndColumns: { field: keyof WeekEnd | "actions"; header: string }[] = [
    { field: "code", header: "Code" },
    { field: "day", header: "Day" },
    { field: "actions", header: "Actions" },
  ];

  publicHolidayColumns: {
    field: keyof PublicHoliday | "actions";
    header: string;
  }[] = [
    { field: "code", header: "Code" },
    { field: "title", header: "Holiday Name" },
    { field: "date", header: "Date" },
    { field: "actions", header: "Actions" },
  ];

  leaveDaysColumns: { field: keyof LeaveDay | "actions"; header: string }[] = [
    { field: "code", header: "Code" },
    { field: "year", header: "Year" },
    { field: "annualLeaves", header: "Annual Leave" },
    { field: "sickLeaves", header: "Sick Leaves" },
    { field: "training", header: "Training" },
    { field: "managerialTasks", header: "Managerial Tasks" },
    { field: "otherActivities", header: "Other Activities" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  weekEndFilters: Record<string, any> = {};
  holidayFilters: Record<string, any> = {};
  leaveDaysFilters: Record<string, any> = {};

  // -------- Fetch functions (typed) --------
  fetchWeekends = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}): ReturnType<ResourcesUnutilizedTime["getWeekEnds"]> =>
    this.service.getWeekEnds({ pageNumber, pageSize, ...filters });

  fetchHolidays = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}): ReturnType<ResourcesUnutilizedTime["getPublicHolidays"]> =>
    this.service.getPublicHolidays({ pageNumber, pageSize, ...filters });

  fetchLeaveDays = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}): ReturnType<ResourcesUnutilizedTime["getLeaveDays"]> =>
    this.service.getLeaveDays({ pageNumber, pageSize, ...filters });

  // -------- Handle filter changes from header --------
  onFiltersChange(
    type: "weekEnd" | "holiday" | "leaveDays",
    filters: Record<string, any>
  ) {
    if (type === "weekEnd") {
      this.weekEndFilters = { ...filters };
      this.weekEndList.loadData(
        this.weekEndList.pagination,
        this.weekEndFilters
      );
    } else if (type === "holiday") {
      this.holidayFilters = { ...filters };
      this.holidayList.loadData(
        this.holidayList.pagination,
        this.holidayFilters
      );
    } else if (type === "leaveDays") {
      this.leaveDaysFilters = { ...filters };
      this.leaveDaysList.loadData(
        this.leaveDaysList.pagination,
        this.leaveDaysFilters
      );
    }
  }

  // -------- Add actions --------
  onAddWeekend() {
    const ref = this.dialogService.open(WeekEndPopup, {
      header: "Add Weekend",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
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

  onAddPublicHolidays() {
    const ref = this.dialogService.open(PublicHolidayPopup, {
      header: "Add Public Holiday",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
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

  onAddLeaveDays() {
    const ref = this.dialogService.open(LeaveDaysPopup, {
      header: "Add Leave Days",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.leaveDaysList.loadData(
          this.leaveDaysList.pagination,
          this.leaveDaysFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Leave Days added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit actions --------
  onEditWeekend(weekend: WeekEnd) {
    const ref = this.dialogService.open(WeekEndPopup, {
      header: "Edit Weekend",
      width: "600px",
      modal: true,
      data: weekend,
    });

    ref.onClose.subscribe((result) => {
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

  onEditHoliday(row: PublicHoliday) {
    const ref = this.dialogService.open(PublicHolidayPopup, {
      header: "Edit Public Holiday",
      width: "600px",
      modal: true,
      data: row,
    });

    ref.onClose.subscribe((result) => {
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

  onEditLeaveDay(row: LeaveDay) {
    const ref = this.dialogService.open(LeaveDaysPopup, {
      header: "Edit Leave Days",
      width: "600px",
      modal: true,
      data: row,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.leaveDaysList.loadData(
          this.leaveDaysList.pagination,
          this.leaveDaysFilters
        );

        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Leave Days updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete actions --------
  onDeleteWeekend(id: number) {
    this.service
      .deleteWeekEnd(id)
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

  onDeleteHoliday(id: number) {
    this.service
      .deletePublicHoliday(id)
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

  onDeleteLeaveDay(id: number) {
    this.service
      .deleteLeaveDay(id)
      .pipe(
        tap(() =>
          this.leaveDaysList.loadData(
            this.leaveDaysList.pagination,
            this.leaveDaysFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Leave Day deleted successfully 🎉",
        })
      );
  }

  // -------- Archive actions --------
  onArchiveWeekend(id: number) {
    this.service
      .archiveWeekEnd(id)
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

  onArchiveHoliday(id: number) {
    this.service
      .archivePublicHoliday(id)
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

  onArchiveLeaveDay(id: number) {
    this.service
      .archiveLeaveDay(id)
      .pipe(
        tap(() =>
          this.leaveDaysList.loadData(
            this.leaveDaysList.pagination,
            this.leaveDaysFilters
          )
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Leave Day archived successfully.",
        })
      );
  }
}
