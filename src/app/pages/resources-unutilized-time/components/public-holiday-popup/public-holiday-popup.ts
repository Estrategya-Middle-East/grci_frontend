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
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";
import { CommonModule } from "@angular/common";
import { ResourcesUnutilizedTime } from "../../services/resources-unutilized-time";

@Component({
  selector: "app-public-holiday-popup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    CommonModule,
  ],
  templateUrl: "./public-holiday-popup.html",
  styleUrls: ["./public-holiday-popup.scss"],
})
export class PublicHolidayPopup {
  private fb = inject(FormBuilder);
  private unutilizedService = inject(ResourcesUnutilizedTime);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const data = this.config.data as
      | { id?: number; title?: string; date?: string }
      | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id || null],
      title: [data?.title || null, Validators.required],
      date: [data?.date ? new Date(data.date) : null, Validators.required],
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.value;

    if (value.id) {
      this.unutilizedService
        .updatePublicHolidays(value.id, { ...value, id: value.id })
        .subscribe(() => this.dialogRef.close(this.formGroup.value));
    } else {
      this.unutilizedService
        .createPublicHolidays(value)
        .subscribe(() => this.dialogRef.close(this.formGroup.value));
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
