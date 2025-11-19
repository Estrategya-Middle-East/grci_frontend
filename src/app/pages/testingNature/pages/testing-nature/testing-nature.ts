import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { TestingNatureTable } from "../../components/testing-nature-table/testing-nature-table";
import { TestingNatureToolbar } from "../../components/testing-nature-toolbar/testing-nature-toolbar";
import { TestingNatureService } from "../../services/testingNatureService/testing-nature-service";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DialogService } from "primeng/dynamicdialog";
import { MessageRequest } from "../../../audit/components/dialogs/message-request/message-request";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { EditTestingNatureDialog } from "../../components/dialogs/edit-testing-nature-dialog/edit-testing-nature-dialog";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";

@Component({
  selector: "app-testing-nature",
  imports: [
    TestingNatureTable,
    TestingNatureToolbar,
    NgbDropdownModule,
    DeleteItemSelectedComponent,
  ],
  providers: [DialogService],
  templateUrl: "./testing-nature.html",
  styleUrl: "./testing-nature.scss",
})
export class TestingNature implements OnInit {
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  viewData: any = {};
  @ViewChild("content", { static: false }) content: any;
  private modalService = inject(NgbModal);
  archiveId: string = "";

  ngOnInit(): void {
    this.getAllData();
  }
  private testingNatureService = inject(TestingNatureService);
  getAllData() {
    this.testingNatureService.getTableData({}).subscribe();
  }
  deleteTestingNature(id: any, title: any) {
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
        this.testingNatureService.deletetestingNatureManamgement(id).subscribe({
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
  editTestingNature(row: any) {
    const ref = this.dialogService.open(EditTestingNatureDialog, {
      header: "Edit Testing Nature",
      width: "600px",
      modal: true,
      data: {
        name: row.name,
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.testingNatureService
          .edittestingNatureManagment({ ...result, id: row.id }, row.id)
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

  archiveTestingNature(id: string, title: string) {
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
    this.testingNatureService
      .archivetestingNatureManagment(this.archiveId)
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
