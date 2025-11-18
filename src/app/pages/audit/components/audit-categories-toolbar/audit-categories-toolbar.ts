import { HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { AddAuditFrequencyDialog } from "../dialogs/add-audit-frequency-dialog/add-audit-frequency-dialog";
import { AddDialog } from "../dialogs/add-dialog/add-dialog";

@Component({
  selector: "app-audit-categories-toolbar",
  imports: [],
  templateUrl: "./audit-categories-toolbar.html",
  styleUrl: "./audit-categories-toolbar.scss",
})
export class AuditCategoriesToolbar {
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private searchSubject = new Subject<string>();
  constructor(
    public auditService: AuditItemService,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          return this.auditService.getAuditCategoriestList({
            ...this.auditService.pagination(),
            FilterValue: searchValue ?? "",
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  getAuditCategoriesList(searchValue: string) {
    this.searchSubject.next(searchValue);
  }
  addNewAuditCategory() {
    const ref = this.dialogService.open(AddDialog, {
      header: "Add Audit Category",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result.value) {
        this.auditService.addAuditCategory(result.value).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.auditService
              .getAuditCategoriestList(this.auditService.pagination())
              .subscribe();
            this.auditService.getAllCategories().subscribe((res) => {
              this.auditService.categoryOptions.set(res);
            });
          },
          error: (err: HttpErrorResponse) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: err.error.error[0],
            });
          },
        });
      }
    });
  }
}
