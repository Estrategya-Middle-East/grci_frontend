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

import { LikelihoodService } from "../../services/likelihood-service";
import { LikelihoodInterface } from "../../models/risk-scoring";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-likelihood-popup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
  ],
  templateUrl: "./likelihood-popup.html",
  styleUrl: "./likelihood-popup.scss",
})
export class LikelihoodPopup implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private service = inject(LikelihoodService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const data = this.config.data as LikelihoodInterface | undefined;

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
      this.service.update(value.id, value).subscribe(
        () => this.dialogRef.close(this.formGroup.value),
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: `Error ${err.error.detail || ""}`,
            detail: err.error.detail,
            life: 5000,
          });
        }
      );
    } else {
      this.service.create(value).subscribe(
        () => this.dialogRef.close(this.formGroup.value),
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: `Error ${err.error.detail || ""}`,
            detail: err.error.detail,
            life: 5000,
          });
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
