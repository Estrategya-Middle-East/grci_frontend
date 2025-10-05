import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { TypePopup } from "../type-popup/type-popup";
import { tap } from "rxjs";
import { TypeInterface } from "../../models/mitigation";
import { TypeService } from "../../services/type";

@Component({
  selector: "app-type",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./type.html",
  styleUrl: "./type.scss",
})
export class Type {
  activeTab = input.required<number>();
  private service = inject(TypeService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("typeList") typeList!: GeneralList<TypeInterface>;

  // -------- Filteration configs --------
  typeFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Types" },
    import: false,
  };

  // -------- Actions configs --------
  typeActions: ShowActions = {
    add: { show: true, label: "New Type", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  typeColumns: {
    field: keyof TypeInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "Id" },
    { field: "value", header: "Mitigation Type Name" },
    { field: "actions", header: "Actions" },
  ];

  typeFilters: Record<string, any> = {};

  // -------- Fetch --------
  fetchTypes = ({
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
    this.typeFilters = { ...filters };
    this.typeList.loadData(this.typeList.pagination, this.typeFilters);
  }

  // -------- Add --------
  onAddType() {
    const ref = this.dialogService.open(TypePopup, {
      header: "Add Type",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.typeList.loadData(this.typeList.pagination, this.typeFilters);
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Type added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditType(type: TypeInterface) {
    const ref = this.dialogService.open(TypePopup, {
      header: "Edit Type",
      width: "600px",
      modal: true,
      data: type,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.typeList.loadData(this.typeList.pagination, this.typeFilters);
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Type updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteType(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.typeList.loadData(this.typeList.pagination, this.typeFilters)
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Type deleted successfully 🎉",
        })
      );
  }

  // -------- Archive --------
  onArchiveType(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.typeList.loadData(this.typeList.pagination, this.typeFilters)
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Type archived successfully.",
        })
      );
  }
}
