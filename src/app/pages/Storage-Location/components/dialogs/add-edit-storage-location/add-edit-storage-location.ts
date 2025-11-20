import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { TestingNatureService } from "../../../../testingNature/services/testingNatureService/testing-nature-service";
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: "app-add-edit-storage-location",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule, // ✅ Added
    InputTextModule,
    CheckboxModule,
  ],
  templateUrl: "./add-edit-storage-location.html",
  styleUrl: "./add-edit-storage-location.scss",
})
export class AddEditStorageLocation {
  private dialogRef = inject(DynamicDialogRef);

  storageForm!: FormGroup;
  constructor(private fb: FormBuilder, public config: DynamicDialogConfig) {
    this.initForm();
  }
  initForm() {
    this.storageForm = this.fb.group({
      name: [
        { value: "", disabled: this.config?.data?.disableAll === true },
        Validators.required,
      ],
      notes: [
        { value: "", disabled: this.config?.data?.disableAll === true },
        Validators.required,
      ],
      path: [
        { value: "", disabled: this.config?.data?.disableAll === true },
        Validators.required,
      ],
      setAsDefault: [
        { value: false, disabled: this.config?.data?.disableAll === true },
      ],
    });
  }
  ngOnInit(): void {
    if (this.config.data) {
      this.storageForm.patchValue({
        name: this.config.data.name,
        setAsDefault: this.config.data.setAsDefault,
        notes: this.config.data.notes,
        path: this.config.data.path,
      });
    }
  }

  onSave() {
    if (this.storageForm.valid) {
      this.dialogRef.close(this.storageForm.value);
    } else {
      this.storageForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
