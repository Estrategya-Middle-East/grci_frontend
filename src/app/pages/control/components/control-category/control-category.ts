import { Component, ViewChild, inject, input } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { ControlCategoryPopup } from "../control-category-popup/control-category-popup";
import { tap } from "rxjs";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { ControlCategoryService } from "../../services/control-category";

@Component({
  selector: "app-control-category",
  standalone: true,
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./control-category.html",
  styleUrl: "./control-category.scss",
})
export class ControlCategory {
  activeTab = input.required<number>();
  private service = inject(ControlCategoryService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("categoryList") categoryList!: GeneralList<lookup>;

  // Filter Configs
  filteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Control Categories" },
    import: false,
  };

  // Actions Configs
  actions: ShowActions = {
    add: { show: true, label: "New Control Category", isLink: false },
    import: { show: false, label: "" },
  };

  // Columns
  columns: {
    field: keyof lookup | "actions";
    header: string;
  }[] = [
    { field: "id", header: "ID" },
    { field: "name", header: "Control Category Name" },
    { field: "actions", header: "Actions" },
  ];

  filters: Record<string, any> = {};

  // Fetch
  fetchCategories = ({
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
    this.categoryList.loadData(this.categoryList.pagination, this.filters);
  }

  onAddCategory() {
    const ref = this.dialogService.open(ControlCategoryPopup, {
      header: "Add Control Category",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.categoryList.loadData(this.categoryList.pagination, this.filters);
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Category added successfully 🎉",
        });
      }
    });
  }

  onEditCategory(category: lookup) {
    const ref = this.dialogService.open(ControlCategoryPopup, {
      header: "Edit Control Category",
      width: "600px",
      modal: true,
      data: category,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.categoryList.loadData(this.categoryList.pagination, this.filters);
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: "Category updated successfully 🎉",
        });
      }
    });
  }

  onDeleteCategory(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.categoryList.loadData(this.categoryList.pagination, this.filters)
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: "Category deleted successfully 🎉",
        })
      );
  }

  onArchiveCategory(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.categoryList.loadData(this.categoryList.pagination, this.filters)
        )
      )
      .subscribe(() =>
        this.messageService.add({
          severity: "info",
          summary: "Archived",
          detail: "Category archived successfully.",
        })
      );
  }
}
