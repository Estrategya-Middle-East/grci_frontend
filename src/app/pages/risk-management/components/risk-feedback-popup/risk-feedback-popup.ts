import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DatePickerModule } from "primeng/datepicker";
import { SelectModule } from "primeng/select";
import { MessageService } from "primeng/api";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs";
import { RiskManagementService } from "../../services/risk-management-service";
import { RiskFeedbackStatusEnum } from "../../models/risk-management";

@Component({
  selector: "app-risk-feedback-popup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: "./risk-feedback-popup.html",
  styleUrls: ["./risk-feedback-popup.scss"],
})
export class RiskFeedbackPopup implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private service = inject(RiskManagementService);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  isEditMode = false;
  loading = true;

  riskId!: number;
  feedbackId!: number | null;

  readonly today = new Date();

  reviewers = signal<{ id: number; name: string }[]>([]);
  statuses = signal<{ label: string; value: number }[]>([
    { label: "Approved", value: RiskFeedbackStatusEnum.Approved },
    { label: "Rejected", value: RiskFeedbackStatusEnum.Rejected },
  ]);

  ngOnInit(): void {
    const data = this.config.data;
    this.riskId = data?.riskId;
    this.feedbackId = data?.feedbackId ?? null;
    this.isEditMode = !!this.feedbackId;

    this.initForm();
    this.loadReviewers();

    if (this.isEditMode && this.feedbackId) {
      this.loadFeedbackDetails();
    } else {
      this.loading = false;
    }
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      id: [{ value: null, disabled: true }],
      riskId: [{ value: this.riskId, disabled: true }],
      feedback: ["", Validators.required],
      status: [null, Validators.required],
      reviewedById: [null, Validators.required],
      reviewedAt: [null, Validators.required],
    });
  }

  private loadReviewers(): void {
    this.service
      .getUsersLookUp()
      .pipe(catchError(() => of([])))
      .subscribe((users) => {
        this.reviewers.set(users || []);
      });
  }

  private loadFeedbackDetails(): void {
    this.service
      .getRiskFeedback(this.feedbackId!)
      .pipe(
        catchError(() => of(null)),
        finalize(() => (this.loading = false))
      )
      .subscribe((feedback) => {
        if (feedback) {
          this.formGroup.patchValue({
            id: feedback.id,
            riskId: feedback.riskId,
            feedback: feedback.feedback,
            status: feedback.status,
            reviewedById: feedback.reviewedById,
            reviewedAt: new Date(feedback.reviewedAt),
          });
        }
      });
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.getRawValue();
    const request$ = this.isEditMode
      ? this.service.updateRiskFeedback(this.feedbackId!, payload)
      : this.service.addRiskFeedback(this.riskId, {
          feedback: payload.feedback,
          status: payload.status,
          reviewedById: payload.reviewedById,
          reviewedAt: payload.reviewedAt,
        });

    request$
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save risk feedback",
          });
          throw err;
        })
      )
      .subscribe((res) => {
        this.messageService.add({
          severity: "success",
          summary: this.isEditMode ? "Updated" : "Saved",
          detail: `Risk feedback ${
            this.isEditMode ? "updated" : "created"
          } successfully 🎉`,
        });
        this.ref.close(res);
      });
  }

  close(): void {
    this.ref.close(null);
  }
}
