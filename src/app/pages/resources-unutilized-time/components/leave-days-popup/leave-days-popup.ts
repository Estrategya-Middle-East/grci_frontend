import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { CommonModule } from "@angular/common";
import { InputNumberModule } from "primeng/inputnumber";
import { ResourcesUnutilizedTime } from "../../services/resources-unutilized-time";
import { LeaveDayInterface } from "../../models/resources-unutilized-time";

@Component({
  selector: "app-leave-days-popup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    CommonModule,
  ],
  templateUrl: "./leave-days-popup.html",
  styleUrls: ["./leave-days-popup.scss"],
})
export class LeaveDaysPopup {
  private fb = inject(FormBuilder);
  private unutilizedService = inject(ResourcesUnutilizedTime);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const data = this.config.data as LeaveDayInterface | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id || null],
      year: [
        data?.year ? new Date(data.year, 0, 1) : null,
        Validators.required,
      ],
      annualLeaves: [
        data?.annualLeaves ?? null,
        [Validators.required, Validators.min(0)],
      ],
      sickLeaves: [
        data?.sickLeaves ?? null,
        [Validators.required, Validators.min(0)],
      ],
      training: [
        data?.training ?? null,
        [Validators.required, Validators.min(0)],
      ],
      managerialTasks: [
        data?.managerialTasks ?? null,
        [Validators.required, Validators.min(0)],
      ],
      otherActivities: [
        data?.otherActivities ?? null,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.value;
    if (value.year instanceof Date) {
      value.year = value.year.getFullYear();
    }

    if (value.id) {
      this.unutilizedService
        .updateLeaveDays(value.id, { ...value, id: value.id })
        .subscribe(() => this.dialogRef.close(this.formGroup.value));
    } else {
      this.unutilizedService
        .createLeaveDays(value)
        .subscribe(() => this.dialogRef.close(this.formGroup.value));
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
