import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { Select, SelectModule } from "primeng/select";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuditItemService } from "../../services/auditItem/audit-item-service";
import { TextareaModule } from "primeng/textarea";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { RadioButtonModule } from "primeng/radiobutton";
import { ToastModule } from "primeng/toast";
import { AuditFeedbackService } from "../../services/auditfeedback/audit-feedback-service";
import { FilterOption } from "../../models/interfaces/audit-item";
import { HttpErrorResponse } from "@angular/common/http";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-audit-feedback-filter",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RadioButtonModule, // ✅ Added
    ButtonModule, // ✅ Added
    InputTextModule, // ✅ Added if needed
    MultiSelectModule,
    ToastModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: "./audit-feedback-filter.html",
  styleUrl: "./audit-feedback-filter.scss",
})
export class AuditFeedbackFilter {
  public auditService = inject(AuditItemService);
  public auditFeedbackService = inject(AuditFeedbackService);
  private messageService = inject(MessageService);
  feedbackForm!: FormGroup;
  statusOptions = [
    { label: "New", value: "0" },
    { label: "Approved", value: "1" },
    { label: "Rejected", value: "2" },
    { label: "Reviewed", value: "3" },
    { label: "Sent", value: "4" },
  ];
  constructor(private fb: FormBuilder) {
    this.initForm();
    this.getAudititemsLookups();
  }
  initForm() {
    this.feedbackForm = this.fb.group({
      auditItemId: ["", Validators.required],
      status: ["", Validators.required],
      feedback: ["", Validators.required],
    });
  }
  getAudititemsLookups() {
    this.auditFeedbackService.getAuditItemsLookup().subscribe({
      next: (res) => {
        this.auditService.auditItemsLookupSignal.set(res);
      },
    });
  }
  onEdit() {
    let editfeedbackDataId =
      this.auditFeedbackService.editFeedback.value.id?.toString() || "";
    this.auditFeedbackService
      .updateAuditFeedback(editfeedbackDataId, {
        status: Number(this.feedbackForm.value.status),
        id: Number(this.feedbackForm.value.auditItemId),
        feedback: this.feedbackForm.value.feedback,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.auditFeedbackService.getTableData({}).subscribe();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: err.error.errors[0],
          });
        },
      });
  }
  onCancel() {
    this.auditFeedbackService.editFeedback = {
      show: false,
      value: {},
    };
  }
  onApply() {
    this.auditFeedbackService
      .createAuditFeedback({
        status: Number(this.feedbackForm.value.status),
        auditItemId: Number(this.feedbackForm.value.auditItemId),
        feedback: this.feedbackForm.value.feedback,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          this.auditFeedbackService.getTableData({}).subscribe();
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: err.error.errors[0],
          });
        },
      });
  }
}
