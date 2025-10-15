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
import { ControlCategoryService } from "../../services/control-category";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-control-category-popup",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: "./control-category-popup.html",
  styleUrl: "./control-category-popup.scss",
})
export class ControlCategoryPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ControlCategoryService);
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
