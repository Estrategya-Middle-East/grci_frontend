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
import { WeekEndInterface } from "../../models/resources-unutilized-time";
import { WeekEndService } from "../../services/week-end-service";

@Component({
  selector: "app-add-weekend-dialog",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: "./week-end-popup.html",
})
export class WeekEndPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(WeekEndService);
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
    const data = this.config.data as WeekEndInterface | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id || null],
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
      this.service
        .update(value.id, { day: value.day, id: value.id })
        .subscribe(() => {
          this.dialogRef.close(this.formGroup.value);
        });
    } else {
      this.service.create({ day: value.day }).subscribe(() => {
        this.dialogRef.close(this.formGroup.value);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
