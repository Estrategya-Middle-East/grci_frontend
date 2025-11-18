import { Component, ViewChild, inject } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { map, tap } from "rxjs";
import { GeneralList } from "../../shared/components/general-list/general-list";
import { HeaderComponent } from "../../shared/components/header/header.component";
import {
  ShowActions,
  ShowFilteration,
} from "../../shared/components/header/models/header.interface";
import { ControlEffectivnessPopup } from "./components/control-effectivness-popup/control-effectivness-popup";
import { ControlEffectivnessService } from "./services/control-effectivness-service";
import { ControlEffectivnessInterface } from "./models/control-effectivness";

@Component({
  selector: "app-control-effectivness",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./control-effectivness.html",
  styleUrls: ["./control-effectivness.scss"],
  providers: [DialogService],
})
export class ControlEffectivness {
  private service = inject(ControlEffectivnessService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("controlsList")
  controlsList!: GeneralList<ControlEffectivnessInterface>;

  // -------- Filteration configs --------
  controlsFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Controls" },
    import: false,
  };

  // -------- Actions configs --------
  controlsActions: ShowActions = {
    add: { show: true, label: "New Control", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  controlsColumns: {
    field: keyof ControlEffectivnessInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "name", header: "Name" },
    { field: "min", header: "Min" },
    { field: "max", header: "Max" },
    { field: "effectivenessPercentage", header: "Effectiveness Percentage" },
    { field: "createdBy", header: "Created By" },
    { field: "createdDate", header: "Created Date" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  controlsFilters: Record<string, any> = {};

  // -------- Fetch function --------
  fetchControls = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) =>
    this.service.getList({ pageNumber, pageSize, ...filters }).pipe(
      map((result) => ({
        ...result,
        items: result.items.map((item) => ({
          ...item,
          createdDate: this.formatDate(item.createdDate),
        })),
      }))
    );

  // -------- Handle filters --------
  onFiltersChange(filters: Record<string, any>) {
    this.controlsFilters = { ...filters };
    this.controlsList.loadData(
      this.controlsList.pagination,
      this.controlsFilters
    );
  }

  // -------- Add --------
  onAddControl() {
    const ref = this.dialogService.open(ControlEffectivnessPopup, {
      header: "Add Control",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Control added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditControl(row: ControlEffectivnessInterface) {
    const ref = this.dialogService.open(ControlEffectivnessPopup, {
      header: "Edit Control",
      width: "600px",
      modal: true,
      data: row,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "Control updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteControl(id: number) {
    this.service
      .delete(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Control deleted successfully 🗑️",
        })
      );
  }

  // -------- Archive --------
  onArchiveControl(id: number) {
    this.service
      .archive(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Control archived successfully.",
        })
      );
  }

  private reloadList() {
    this.controlsList.loadData(
      this.controlsList.pagination,
      this.controlsFilters
    );
  }

  formatDate(dateStr: string | undefined) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${day}/${month}/${year}  ${hour12}:${minutes} ${ampm}`;
  }
}
