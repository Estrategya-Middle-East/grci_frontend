import { Component, inject, input, ViewChild } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { GeneralList } from "../../../../shared/components/general-list/general-list";
import {
  ShowActions,
  ShowFilteration,
} from "../../../../shared/components/header/models/header.interface";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { CategoryPopup } from "../category-popup/category-popup";
import { tap } from "rxjs";
import { CategoryInterface } from "../../models/mitigation";
import { CategoryService } from "../../services/category";

@Component({
  selector: "app-category",
  imports: [HeaderComponent, GeneralList],
  templateUrl: "./category.html",
  styleUrl: "./category.scss",
})
export class Category {
  activeTab = input.required<number>();
  private service = inject(CategoryService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  @ViewChild("categoryList") categoryList!: GeneralList<CategoryInterface>;

  // -------- Filteration configs --------
  categoryFilteration: ShowFilteration = {
    tabeOne: { show: false, label: "" },
    tabeTwo: { show: false, label: "" },
    search: { show: true, label: "Search Categories" },
    import: false,
  };

  // -------- Actions configs --------
  categoryActions: ShowActions = {
    add: { show: true, label: "New Category", isLink: false },
    import: { show: false, label: "" },
  };

  // -------- Columns --------
  categoryColumns: {
    field: keyof CategoryInterface | "actions";
    header: string;
  }[] = [
    { field: "id", header: "Id" },
    { field: "value", header: "Mitigation Category Name" },
    { field: "actions", header: "Actions" },
  ];

  categoryFilters: Record<string, any> = {};

  // -------- Fetch --------
  fetchCategories = ({
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
    this.categoryFilters = { ...filters };
    this.categoryList.loadData(
      this.categoryList.pagination,
      this.categoryFilters
    );
  }

  // -------- Add --------
  onAddCategory() {
    const ref = this.dialogService.open(CategoryPopup, {
      header: "Add Category",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.categoryList.loadData(
          this.categoryList.pagination,
          this.categoryFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Category added successfully 🎉",
        });
      }
    });
  }

  // -------- Edit --------
  onEditCategory(category: CategoryInterface) {
    const ref = this.dialogService.open(CategoryPopup, {
      header: "Edit Category",
      width: "600px",
      modal: true,
      data: category,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.categoryList.loadData(
          this.categoryList.pagination,
          this.categoryFilters
        );
        this.messageService.add({
          severity: "success",
          summary: "Saved",
          detail: "Category updated successfully 🎉",
        });
      }
    });
  }

  // -------- Delete --------
  onDeleteCategory(id: number) {
    this.service
      .delete(id)
      .pipe(
        tap(() =>
          this.categoryList.loadData(
            this.categoryList.pagination,
            this.categoryFilters
          )
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

  // -------- Archive --------
  onArchiveCategory(id: number) {
    this.service
      .archive(id)
      .pipe(
        tap(() =>
          this.categoryList.loadData(
            this.categoryList.pagination,
            this.categoryFilters
          )
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
