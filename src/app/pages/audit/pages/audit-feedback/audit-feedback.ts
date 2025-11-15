import { Component, OnInit } from "@angular/core";
import { AuditFeedbackToolbar } from "../../components/audit-feedback-toolbar/audit-feedback-toolbar";
import { AuditFeedbackFilter } from "../../components/audit-feedback-filter/audit-feedback-filter";
import { AuditTable } from "../../components/audit-table/audit-table";
import { AuditFeedbackService } from "../../services/auditfeedback/audit-feedback-service";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogService } from "primeng/dynamicdialog";
import { MessageRequest } from "../../components/dialogs/message-request/message-request";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { FeedbackItem } from "../../models/interfaces/audit-feedback";

@Component({
  selector: "app-audit-feedback",
  imports: [
    AuditFeedbackToolbar,
    AuditFeedbackFilter,
    AuditTable,
    NgbDropdownModule,
  ],
  providers: [DialogService],
  templateUrl: "./audit-feedback.html",
  styleUrl: "./audit-feedback.scss",
})
export class AuditFeedback implements OnInit {
  constructor(
    private auditFeedback: AuditFeedbackService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
    console.log(this.auditFeedback.editFeedback);
  }
  ngOnInit(): void {
    this.getlist();
  }
  getlist() {
    this.auditFeedback.getTableData({}).subscribe();
  }
  deleteAuditItemFeedback(id: string, title: string) {
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
        this.auditFeedback.deleteAuditFeedback(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            ref.close();
            this.getlist();
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
  editAuditItemFeedback(row: FeedbackItem) {
    this.auditFeedback.editFeedback = {
      show: true,
      value: { ...row },
    };
  }
}
