import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { StorageLocationService } from "../../services/storageLocation/storage-location-service";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AddEditStorageLocation } from "../dialogs/add-edit-storage-location/add-edit-storage-location";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-storage-location-toolbar",
  imports: [],
  providers: [DialogService],
  templateUrl: "./storage-location-toolbar.html",
  styleUrl: "./storage-location-toolbar.scss",
})
export class StorageLocationToolbar implements OnInit {
  private MessageService = inject(MessageService);
  private dialogService = inject(DialogService);
  searchSubject: Subject<string> = new Subject();
  constructor(
    public stoarageLocationService: StorageLocationService,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          return this.stoarageLocationService.getTableData({
            ...this.stoarageLocationService.pagination(),
            FilterValue: searchValue ?? "",
            FilterField: "name",
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  searchTitle(event: string) {
    this.searchSubject.next(event);
  }
  addNewStorageLocation() {
    const ref = this.dialogService.open(AddEditStorageLocation, {
      header: "Add Storage Location",
      width: "600px",
      modal: true,
    });
    ref?.onClose.subscribe((result) => {
      if (result) {
        this.stoarageLocationService
          .createstorageLocation({ ...result })
          .subscribe({
            next: (res) => {
              this.MessageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.stoarageLocationService.getTableData({}).subscribe();
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
