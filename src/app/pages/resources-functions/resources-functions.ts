import { Component, ViewChild, inject } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { tap } from "rxjs";
import { GeneralList } from "../../shared/components/general-list/general-list";
import { lookup } from "../../shared/models/lookup.mdoel";
import {
  ShowActions,
  ShowFilteration,
} from "../../shared/components/header/models/header.interface";
import { ResourcesFunctionsPopup } from "./components/resources-functions-popup/resources-functions-popup";
import { ResourceFunctionsService } from "./services/resources-functions";
import { HeaderComponent } from "../../shared/components/header/header.component";

@Component({
  selector: "app-resources-functions",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./resources-functions.html",
  styleUrls: ["./resources-functions.scss"],
  providers: [DialogService],
})
export class ResourcesFunctions {
  private service = inject(ResourceFunctionsService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("functionsList") functionsList!: GeneralList<lookup>;

  // -------- Filteration configs --------
  functionsFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Functions" },
    import: false,
  };

  // -------- Actions configs --------
  functionsActions: ShowActions = {
    add: { show: true, label: "New Function", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  functionsColumns: { field: keyof lookup | "actions"; header: string }[] = [
    { field: "id", header: "ID" },
    { field: "name", header: "Function Name" },
    { field: "actions", header: "Actions" },
  ];

  // -------- Filters --------
  functionsFilters: Record<string, any> = {};

  // -------- Fetch function --------
  fetchFunctions = ({
    pageNumber = 1,
    pageSize = 10,
    ...filters
  }: {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  } = {}) => this.service.getList({ pageNumber, pageSize, ...filters });

  // -------- Handle filters --------
  onFiltersChange(filters: Record<string, any>) {
    this.functionsFilters = { ...filters };
    this.functionsList.loadData(
      this.functionsList.pagination,
      this.functionsFilters
    );
  }

  // -------- Add --------
  onAddFunction() {
    const ref = this.dialogService.open(ResourcesFunctionsPopup, {
      header: "Add Function",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.reloadList();
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Function added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditFunction(row: lookup) {
    const ref = this.dialogService.open(ResourcesFunctionsPopup, {
      header: "Edit Function",
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
          detail: "Function updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteFunction(id: number) {
    this.service
      .delete(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Function deleted successfully 🗑️",
        })
      );
  }

  // -------- Archive --------
  onArchiveFunction(id: number) {
    this.service
      .archive(id)
      .pipe(tap(() => this.reloadList()))
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Function archived successfully.",
        })
      );
  }

  private reloadList() {
    this.functionsList.loadData(
      this.functionsList.pagination,
      this.functionsFilters
    );
  }
}
