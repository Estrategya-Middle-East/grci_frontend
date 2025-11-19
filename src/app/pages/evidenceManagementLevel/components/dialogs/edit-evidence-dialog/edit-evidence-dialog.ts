import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { TextareaModule } from "primeng/textarea";
import { AuditItemService } from "../../../../audit/services/auditItem/audit-item-service";
import { EVManagmentService } from "../../../services/EVManagementLevel/evmanagment-service";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "app-edit-evidence-dialog",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule, // ✅ Added
    TextareaModule,
    InputTextModule,
  ],
  templateUrl: "./edit-evidence-dialog.html",
  styleUrl: "./edit-evidence-dialog.scss",
})
export class EditEvidenceDialog {
  private dialogRef = inject(DynamicDialogRef);

  evForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private evService: EVManagmentService,
    public config: DynamicDialogConfig
  ) {
    this.initForm();
  }
  initForm() {
    this.evForm = this.fb.group({
      description: ["", Validators.required],
      name: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.config.data) {
      this.evForm.patchValue({
        description: this.config.data.describtion,
        name: this.config.data.name,
      });
    }
  }

  onSave() {
    if (this.evForm.valid) {
      this.dialogRef.close(this.evForm.value);
    } else {
      this.evForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
