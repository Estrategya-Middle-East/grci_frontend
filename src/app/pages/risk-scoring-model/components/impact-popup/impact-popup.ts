import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { InputNumberModule } from "primeng/inputnumber";

import { ImpactService } from "../../services/impact-service";
import { ImpactInterface } from "../../models/risk-scoring";

@Component({
  selector: "app-impact-popup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
  ],
  templateUrl: "./impact-popup.html",
  styleUrl: "./impact-popup.scss",
})
export class ImpactPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ImpactService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const data = this.config.data as ImpactInterface | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id || null],
      title: [data?.title || "", Validators.required],
      value: [data?.value ?? null, [Validators.required, Validators.min(0)]],
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
        .update(value.id, value)
        .subscribe(() => this.dialogRef.close(this.formGroup.value));
    } else {
      this.service
        .create(value)
        .subscribe(() => this.dialogRef.close(this.formGroup.value));
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
