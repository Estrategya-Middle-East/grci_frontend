import { Component, DestroyRef } from "@angular/core";
import { EVManagmentService } from "../../services/EVManagementLevel/evmanagment-service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject, debounceTime, distinctUntilChanged, switchMap } from "rxjs";

@Component({
  selector: "app-evlevel-toolbar",
  imports: [],
  templateUrl: "./evlevel-toolbar.html",
  styleUrl: "./evlevel-toolbar.scss",
})
export class EVLevelToolbar {
  searchSubject: Subject<string> = new Subject();

  constructor(
    public evService: EVManagmentService,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          return this.evService.getTableData({
            ...this.evService.pagination(),
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
