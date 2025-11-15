import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ControlEffectivnessAssessmentInterface } from "../../models/control-effectivness-assessment";
import { ControlEffectivnessAssessmentService } from "../../services/control-effectivness-assessment-service";
import { catchError, forkJoin, of } from "rxjs";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { SelectModule } from "primeng/select";

@Component({
  selector: "app-control-effectivness-assessment-popup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: "./control-effectivness-assessment-popup.html",
  styleUrl: "./control-effectivness-assessment-popup.scss",
})
export class ControlEffectivnessAssessmentPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ControlEffectivnessAssessmentService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  risksOptions!: lookup[];
  controlsOptions!: lookup[];

  formGroup!: FormGroup;

  ngOnInit(): void {
    this.loadDropdowns();

    const data = this.config.data as
      | ControlEffectivnessAssessmentInterface
      | undefined;
    console.log(data);

    this.formGroup = this.fb.group({
      id: [data?.id ?? null],
      controlRiskId: [data?.controlRiskId ?? "", Validators.required],
      controlName: [data?.controlName ?? "", Validators.required],
      effectivenessPercentage: [
        data?.effectivenessPercentage ?? 0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      comments: [data?.comments ?? "", Validators.required],
    });
  }

  private loadDropdowns(): void {
    forkJoin({
      controls: this.service.getControlsLookup().pipe(catchError(() => of([]))),
      risks: this.service.getRisksLookup().pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      this.risksOptions = res.risks;
      this.controlsOptions = res.controls;
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.value;
    const request$ = value.id
      ? this.service.update(value.id, value)
      : this.service.create(value);

    request$.subscribe(() => this.dialogRef.close(true));
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
