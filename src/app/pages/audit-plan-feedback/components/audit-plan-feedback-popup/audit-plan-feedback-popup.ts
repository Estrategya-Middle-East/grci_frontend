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
import { SelectModule } from "primeng/select";
import { InputTextModule } from "primeng/inputtext";
import { MessageService } from "primeng/api";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { AuditPlanFeedbackService } from "../../services/audit-plan-feedback-service";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { AuditPlanFeedbackInterface } from "../../models/audit-plan-feedback";

@Component({
  selector: "app-audit-plan-feedback-popup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
  ],
  templateUrl: "./audit-plan-feedback-popup.html",
  styleUrls: ["./audit-plan-feedback-popup.scss"],
})
export class AuditPlanFeedbackPopup implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private service = inject(AuditPlanFeedbackService);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  isEditMode = false;
  loading = true;

  feedbackId!: number | null;
  auditPlanId!: number | null;

  // auditPlans = signal<lookup[]>([]);

  statusOptions = [
    { label: "Approved", value: 1 },
    { label: "Rejected", value: 2 },
  ];

  ngOnInit(): void {
    const data = this.config.data;
    this.feedbackId = data?.feedbackId ?? null;
    this.auditPlanId = data?.auditPlanId ?? null;
    this.isEditMode = !!this.feedbackId;

    this.initForm();
    this.loadDropdowns();
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      // auditPlanId: [null, Validators.required],
      status: [null, Validators.required],
      feedback: ["", [Validators.required]],
    });
  }

  private loadDropdowns(): void {
    // const requests: any = {
    //   plans: this.service.getPlansLookup().pipe(catchError(() => of([]))),
    // };

    if (this.isEditMode && this.feedbackId) {
      // requests.feedback = this.service
      //   .getById(this.feedbackId)
      //   .pipe(catchError(() => of(null)));
      this.service
        .getById(this.feedbackId)
        .pipe(catchError(() => of(null)))
        .subscribe((res) => {
          if (res) {
            this.formGroup.patchValue({
              status: res.status,
              feedback: res.feedback,
            });
          }
        });
    }

    // forkJoin({
    //   plans: requests.plans as Observable<lookup[]>,
    //   feedback: (requests.feedback ??
    //     of(null)) as Observable<AuditPlanFeedbackInterface | null>,
    // })
    //   .pipe(finalize(() => (this.loading = false)))
    //   .subscribe(({ plans, feedback }) => {
    //     this.auditPlans.set(plans ?? []);

    //     if (feedback) {
    //       this.formGroup.patchValue({
    //         auditPlanId: feedback.auditPlanId,
    //         status: feedback.status,
    //         feedback: feedback.feedback,
    //       });
    //     }
    //   });
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.value;
    payload.auditPlanId = this.auditPlanId;

    const request$ = this.isEditMode
      ? this.service.update(this.feedbackId!, payload)
      : this.service.create(payload);

    request$
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save feedback",
          });
          throw err;
        })
      )
      .subscribe((res) => {
        this.messageService.add({
          severity: "success",
          summary: this.isEditMode ? "Updated" : "Saved",
          detail: `Feedback ${
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
