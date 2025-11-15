import { Component, OnInit, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ControlEffectivnessService } from "../../services/control-effectivness-service";
import { ControlEffectivnessInterface } from "../../models/control-effectivness";

@Component({
  selector: "app-control-effectivness-popup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: "./control-effectivness-popup.html",
  styleUrl: "./control-effectivness-popup.scss",
})
export class ControlEffectivnessPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ControlEffectivnessService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const data = this.config.data as ControlEffectivnessInterface | undefined;

    this.formGroup = this.fb.group(
      {
        id: [data?.id ?? null],
        name: [data?.name ?? "", Validators.required],
        min: [
          data?.min ?? 0,
          [Validators.required, Validators.min(0), Validators.max(1)],
        ],
        max: [
          data?.max ?? 0,
          [Validators.required, Validators.min(0), Validators.max(1)],
        ],
        effectivenessPercentage: [
          data?.effectivenessPercentage ?? 0,
          [Validators.required, Validators.min(0), Validators.max(100)],
        ],
      },
      {
        validators: this.rangeValidator,
      }
    );
  }

  private rangeValidator(control: AbstractControl): ValidationErrors | null {
    const min = control.get("min")?.value;
    const max = control.get("max")?.value;

    if (
      min == null ||
      max == null ||
      isNaN(min) ||
      isNaN(max) ||
      min < 0 ||
      max > 1 ||
      min > max
    ) {
      return { invalidRange: true };
    }

    return null;
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
