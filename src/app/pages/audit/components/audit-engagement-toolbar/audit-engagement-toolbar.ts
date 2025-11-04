import { HttpErrorResponse } from "@angular/common/http";
import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { AddDialog } from "../dialogs/add-dialog/add-dialog";
import { AddEditEngagement } from "../dialogs/add-edit-engagement/add-edit-engagement";

@Component({
  selector: "app-audit-engagement-toolbar",
  imports: [],
  providers: [DialogService],
  templateUrl: "./audit-engagement-toolbar.html",
  styleUrl: "./audit-engagement-toolbar.scss",
})
export class AuditEngagementToolbar {
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
          return this.auditService.getAuditEngagementList({
            ...this.auditService.pagination(),
            FilterValue: searchValue ?? "",
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  getAuditEngagementList(searchValue: string) {
    this.searchSubject.next(searchValue);
  }
  addNewAuditEngagement() {
    const ref = this.dialogService.open(AddEditEngagement, {
      header: "Add Audit Engagement",
      width: "600px",
      modal: true,
    });

    ref.onClose.subscribe((result) => {
      if (result) {
        this.auditService.addAuditEngagement(result).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            this.auditService
              .getAuditEngagementList(this.auditService.pagination())
              .subscribe();
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
