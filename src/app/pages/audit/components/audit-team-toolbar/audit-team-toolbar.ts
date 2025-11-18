import { Component, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { AuditFeedbackService } from "../../services/auditfeedback/audit-feedback-service";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { AuditTeamService } from "../../services/auditTeam/audit-team-service";

@Component({
  selector: "app-audit-team-toolbar",
  imports: [],
  templateUrl: "./audit-team-toolbar.html",
  styleUrl: "./audit-team-toolbar.scss",
})
export class AuditTeamToolbar {
  searchSubject: Subject<string> = new Subject();

  constructor(
    public auditService: AuditItemService,
    private auditFeedback: AuditFeedbackService,
    private destroyRef: DestroyRef,
    private auditTeamService: AuditTeamService
  ) {}
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          return this.auditTeamService.getTableData({
            ...this.auditService.pagination(),
            FilterValue: searchValue ?? "",
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
