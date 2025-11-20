import { Component, inject, ViewChild } from "@angular/core";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { StorageLocationService } from "../../services/storageLocation/storage-location-service";
import { MessageRequest } from "../../../audit/components/dialogs/message-request/message-request";
import { HttpErrorResponse } from "@angular/common/http";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { StorageLocationToolbar } from "../../components/storage-location-toolbar/storage-location-toolbar";
import { StorageLocationTable } from "../../components/storage-location-table/storage-location-table";
import { AddEditStorageLocation } from "../../components/dialogs/add-edit-storage-location/add-edit-storage-location";

@Component({
  selector: "app-storage-location",
  imports: [
    DeleteItemSelectedComponent,
    StorageLocationToolbar,
    StorageLocationTable,
    NgbDropdownModule,
  ],
  providers: [DialogService],
  templateUrl: "./storage-location.html",
  styleUrl: "./storage-location.scss",
})
export class StorageLocation {
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  viewData: any = {};
  @ViewChild("content", { static: false }) content: any;
  private modalService = inject(NgbModal);
  archiveId: string = "";

  ngOnInit(): void {
    this.getAllData();
  }
  private storageLocationService = inject(StorageLocationService);
  getAllData() {
    this.storageLocationService.getTableData({}).subscribe();
  }
  deleteStorageLocation(id: any, title: any) {
    const ref = this.dialogService.open(MessageRequest, {
      header: " ", // Empty space to show the close button, or remove for no header
      width: "600px",
      height: "370px",
      modal: true, // This adds the backdrop
      dismissableMask: false, // Prevents closing when clicking outside
      closable: false, // Remove the X button if you want
      data: {
        itemName: title, // Pass the item name to display
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.storageLocationService.deletestorageLocation(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            ref.close();
            this.getAllData();
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
  editStorageLocation(row: any) {
    const ref = this.dialogService.open(AddEditStorageLocation, {
      header: "Edit STorage Location",
      width: "600px",
      modal: true,
      data: {
        name: row.name,
        setAsDefault: row.default,
        path: row.path,
        notes: row.notes,
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.storageLocationService
          .editstorageLocation({ ...result, id: row.id }, row.id)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.getAllData();
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
  viewStorageLocation(row: any) {
    const ref = this.dialogService.open(AddEditStorageLocation, {
      header: "View Storage Location",
      width: "600px",
      modal: true,
      data: {
        name: row.name,
        setAsDefault: row.default,
        path: row.path,
        notes: row.notes,
        disableAll: true,
      },
    });
  }
  archiveStorageLocation(id: string, title: string) {
    this.archiveId = id;
    this.viewData = {
      title: `Archive “${title}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.modalService.open(this.content, { centered: true });
  }
  close() {
    this.modalService.dismissAll();
  }
  send() {
    this.storageLocationService
      .archivestorageLocation(this.archiveId)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.getAllData();
          this.close();
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
}
