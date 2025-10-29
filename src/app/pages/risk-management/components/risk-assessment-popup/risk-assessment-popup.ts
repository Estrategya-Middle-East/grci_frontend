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
import { RiskManagementService } from "../../services/risk-management-service";
import { MessageService } from "primeng/api";
import { forkJoin, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { DatePickerModule } from "primeng/datepicker";

@Component({
  selector: "app-risk-assessment-popup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    // DatePickerModule,
  ],
  templateUrl: "./risk-assessment-popup.html",
  styleUrls: ["./risk-assessment-popup.scss"],
})
export class RiskAssessmentPopup implements OnInit {
  readonly today = new Date();
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private service = inject(RiskManagementService);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  isEditMode = false;
  loading = true;

  riskId!: number;
  assessmentId!: number | null;

  likelihoodOptions = signal<{ id: number; name: string }[]>([]);
  impactOptions = signal<{ id: number; name: string }[]>([]);

  ngOnInit(): void {
    const data = this.config.data;
    this.riskId = data?.riskId;
    this.assessmentId = data?.assessmentId ?? null;
    this.isEditMode = !!this.assessmentId;

    this.initForm();
    this.loadDropdowns();
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      likelihoodScaleId: [null, Validators.required],
      impactScaleId: [null, Validators.required],
      // validity: [null, Validators.required],
      comments: [""],
    });
  }

  private loadDropdowns(): void {
    const requests = {
      likelihoods: this.service
        .getRiskLikelihoodLookUp()
        .pipe(catchError(() => of([]))),
      impacts: this.service
        .getRiskImpactsLookUp()
        .pipe(catchError(() => of([]))),
    };

    // If edit mode, also load the assessment details
    if (this.isEditMode && this.assessmentId) {
      Object.assign(requests, {
        assessment: this.service
          .getRiskAssesment(this.assessmentId)
          .pipe(catchError(() => of(null))),
      });
    }

    forkJoin(requests)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(({ likelihoods, impacts, assessment }: any) => {
        this.likelihoodOptions.set(likelihoods || []);
        this.impactOptions.set(impacts || []);

        if (assessment) {
          this.formGroup.patchValue({
            likelihoodScaleId: assessment.likelihoodScaleId,
            impactScaleId: assessment.impactScaleId,
            // validity: assessment.validity,
            comments: assessment.comments || "",
          });
        }
      });
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.value;
    const request$ = this.isEditMode
      ? this.service.updateRiskAssessment(this.assessmentId!, payload)
      : this.service.addRiskAssessment(this.riskId, payload);

    request$
      .pipe(
        finalize(() => (this.loading = false)),
        catchError((err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save risk assessment",
          });
          throw err;
        })
      )
      .subscribe((res) => {
        this.messageService.add({
          severity: "success",
          summary: this.isEditMode ? "Updated" : "Saved",
          detail: `Risk assessment ${
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
