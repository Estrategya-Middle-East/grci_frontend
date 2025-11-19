import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TestingNatureService } from "../../../services/testingNatureService/testing-nature-service";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";

@Component({
  selector: "app-edit-testing-nature-dialog",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule, // ✅ Added
    InputTextModule,
  ],
  templateUrl: "./edit-testing-nature-dialog.html",
  styleUrl: "./edit-testing-nature-dialog.scss",
})
export class EditTestingNatureDialog {
  private dialogRef = inject(DynamicDialogRef);

  testingForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private testingService: TestingNatureService,
    public config: DynamicDialogConfig
  ) {
    this.initForm();
  }
  initForm() {
    this.testingForm = this.fb.group({
      name: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.config.data) {
      this.testingForm.patchValue({
        name: this.config.data.name,
      });
    }
  }

  onSave() {
    if (this.testingForm.valid) {
      this.dialogRef.close(this.testingForm.value);
    } else {
      this.testingForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
