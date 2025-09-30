import { Component, inject, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { ResourcesUnutilizedTime } from "../../services/resources-unutilized-time";

@Component({
  selector: "app-add-weekend-dialog",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: "./week-end-popup.html",
})
export class WeekEndPopup implements OnInit {
  private fb = inject(FormBuilder);
  private unutilizedService = inject(ResourcesUnutilizedTime);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  daysOfWeek = [
    { name: "Sunday", value: "Sunday" },
    { name: "Monday", value: "Monday" },
    { name: "Tuesday", value: "Tuesday" },
    { name: "Wednesday", value: "Wednesday" },
    { name: "Thursday", value: "Thursday" },
    { name: "Friday", value: "Friday" },
    { name: "Saturday", value: "Saturday" },
  ];

  ngOnInit(): void {
    // Use config.data to populate form if editing
    const data = this.config.data as { day?: string; id?: number } | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id || null], // store id for editing
      day: [data?.day || "", Validators.required],
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.value;

    if (value.id) {
      // Editing
      this.unutilizedService
        .updateWeekEnd(value.id, { day: value.day, id: value.id })
        .subscribe(() => {
          this.dialogRef.close(this.formGroup.value);
        });
    } else {
      // Creating
      this.unutilizedService.createWeekEnd({ day: value.day }).subscribe(() => {
        this.dialogRef.close(this.formGroup.value);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
