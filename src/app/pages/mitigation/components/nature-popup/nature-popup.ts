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
import { NatureService } from "../../services/nature";
import { NatureInterface } from "../../models/mitigation";

@Component({
  selector: "app-nature-popup",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: "./nature-popup.html",
  styleUrl: "./nature-popup.scss",
})
export class NaturePopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(NatureService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const data = this.config.data as NatureInterface | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id || null],
      value: [data?.value || "", Validators.required],
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
