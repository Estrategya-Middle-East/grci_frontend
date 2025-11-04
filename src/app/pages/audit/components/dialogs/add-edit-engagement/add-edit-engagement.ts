import { Component, inject } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuditItemService } from "../../../services/auditItem/audit-item-service";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TextareaModule } from "primeng/textarea";

@Component({
  selector: "app-add-edit-engagement",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule, // ✅ Added
    TextareaModule,
  ],
  templateUrl: "./add-edit-engagement.html",
  styleUrl: "./add-edit-engagement.scss",
})
export class AddEditEngagement {
  private dialogRef = inject(DynamicDialogRef);

  frequancyForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auditService: AuditItemService,
    public config: DynamicDialogConfig
  ) {
    this.initForm();
  }
  initForm() {
    this.frequancyForm = this.fb.group({
      description: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.config.data) {
      this.frequancyForm.patchValue({
        description: this.config.data.describtion,
      });
    }
  }

  onSave() {
    if (this.frequancyForm.valid) {
      this.dialogRef.close(this.frequancyForm.value);
    } else {
      this.frequancyForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
