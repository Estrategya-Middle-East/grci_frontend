import { Component, DestroyRef, inject } from "@angular/core";
import { TestingNatureService } from "../../services/testingNatureService/testing-nature-service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { Dialog } from "primeng/dialog";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { EditTestingNatureDialog } from "../dialogs/edit-testing-nature-dialog/edit-testing-nature-dialog";

@Component({
  selector: "app-testing-nature-toolbar",
  standalone: true,
  imports: [],
  providers: [DialogService],
  templateUrl: "./testing-nature-toolbar.html",
  styleUrl: "./testing-nature-toolbar.scss",
})
export class TestingNatureToolbar {
  private MessageService = inject(MessageService);
  private testingNatureService = inject(TestingNatureService);
  private dialogService = inject(DialogService);
  searchSubject: Subject<string> = new Subject();

  constructor(
    public testingService: TestingNatureService,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          return this.testingService.getTableData({
            ...this.testingService.pagination(),
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
  addNewTestingNature() {
    const ref = this.dialogService.open(EditTestingNatureDialog, {
      header: "Add Testing Nature",
      width: "600px",
      modal: true,
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.testingNatureService
          .createtestingNatureManagment({ ...result })
          .subscribe({
            next: (res) => {
              this.MessageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.testingNatureService.getTableData({}).subscribe();
            },
            error: (err: HttpErrorResponse) => {
              this.MessageService.add({
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
