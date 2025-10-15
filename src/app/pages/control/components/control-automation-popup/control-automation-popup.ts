import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { ControlAutomationService } from "../../services/control-automation";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-control-automation-popup",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: "./control-automation-popup.html",
  styleUrl: "./control-automation-popup.scss",
})
export class ControlAutomationPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ControlAutomationService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;

  ngOnInit(): void {
    const data = this.config.data as lookup | undefined;

    this.formGroup = this.fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? "", Validators.required],
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
