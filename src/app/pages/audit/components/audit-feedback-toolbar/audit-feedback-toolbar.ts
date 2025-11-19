import { Component, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuditFeedbackService } from "../../services/auditfeedback/audit-feedback-service";

@Component({
  selector: "app-audit-feedback-toolbar",
  imports: [CommonModule, RouterModule],
  templateUrl: "./audit-feedback-toolbar.html",
  styleUrl: "./audit-feedback-toolbar.scss",
})
export class AuditFeedbackToolbar {
  searchSubject: Subject<string> = new Subject();

  constructor(
    public auditService: AuditItemService,
    private auditFeedback: AuditFeedbackService,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          return this.auditFeedback.getTableData({
            ...this.auditService.pagination(),
            FilterValue: searchValue ?? "",
            FilterField: "feedback",
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  searchTitle(event: string) {
    this.searchSubject.next(event);
  }
}
