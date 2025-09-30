import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";

import { RatingService } from "../../services/rating-service";
import { RiskRatingInterface } from "../../models/risk-scoring";
import { SelectModule } from "primeng/select";

@Component({
  selector: "app-rating-popup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
  ],
  templateUrl: "./rating-popup.html",
  styleUrl: "./rating-popup.scss",
})
export class RatingPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(RatingService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;

  // dropdown options for color
  colorOptions = [
    { label: "Green", value: "green" },
    { label: "Orange", value: "orange" },
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
  ];

  ngOnInit(): void {
    const data = this.config.data as RiskRatingInterface | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id || null],
      title: [data?.title || "", Validators.required],
      color: [data?.color || null, Validators.required],
      scoreMin: [
        data?.scoreMin ?? null,
        [Validators.required, Validators.min(0)],
      ],
      scoreMax: [
        data?.scoreMax ?? null,
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

    if (value.id) {
      this.service.update(value.id, value).subscribe(
        () => this.dialogRef.close(this.formGroup.value),
        (err) => this.showError(err)
      );
    } else {
      this.service.create(value).subscribe(
        () => this.dialogRef.close(this.formGroup.value),
        (err) => this.showError(err)
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  private showError(err: any): void {
    this.messageService.add({
      severity: "error",
      summary: `Error ${err.error?.detail || ""}`,
      detail: err.error?.detail || "An error occurred",
      life: 5000,
    });
  }
}
