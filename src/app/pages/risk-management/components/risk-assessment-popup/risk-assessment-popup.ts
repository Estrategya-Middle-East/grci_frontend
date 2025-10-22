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
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-risk-assessment-popup",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
  ],
  templateUrl: "./risk-assessment-popup.html",
  styleUrls: ["./risk-assessment-popup.scss"],
})
export class RiskAssessmentPopup implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private service = inject(RiskManagementService);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  riskId!: number;
  isEditMode = false;
  loading = true;

  likelihoodOptions = signal<{ id: number; name: string }[]>([]);
  impactOptions = signal<{ id: number; name: string }[]>([]);

  ngOnInit(): void {
    this.riskId = this.config.data?.riskId;
    this.initForm();
    this.loadDropdowns();
  }

  private initForm(): void {
    this.formGroup = this.fb.group({
      likelihoodScaleId: [null, Validators.required],
      impactScaleId: [null, Validators.required],
      comments: [""],
    });
  }

  private loadDropdowns(): void {
    forkJoin({
      likelihoods: this.service
        .getRiskLikelihoodLookUp()
        .pipe(catchError(() => of([]))),
      impacts: this.service
        .getRiskImpactsLookUp()
        .pipe(catchError(() => of([]))),
      assessment: this.service
        .getRiskAssesment(this.riskId)
        .pipe(catchError(() => of(null))),
    }).subscribe(({ likelihoods, impacts, assessment }) => {
      this.likelihoodOptions.set(likelihoods || []);
      this.impactOptions.set(impacts || []);

      if (assessment) {
        this.isEditMode = true;
        this.formGroup.patchValue({
          likelihoodScaleId: assessment.likelihoodScaleId,
          impactScaleId: assessment.impactScaleId,
          comments: assessment.comments || "",
        });
      }

      this.loading = false;
    });
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.value;
    const request$ = this.isEditMode
      ? this.service.updateRiskAssessment(this.riskId, payload)
      : this.service.addRiskAssessment(this.riskId, payload);

    request$.subscribe(() => {
      this.messageService.add({
        severity: "success",
        summary: this.isEditMode ? "Updated" : "Saved",
        detail: `Risk assessment ${
          this.isEditMode ? "updated" : "saved"
        } successfully 🎉`,
      });
      this.ref.close(payload);
    });
  }

  close(): void {
    this.ref.close();
  }
}
