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
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { ResourceSkillsService } from "../../services/resources-skills";

@Component({
  selector: "app-resources-skills-popup",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: "./resources-skills-popup.html",
  styleUrl: "./resources-skills-popup.scss",
})
export class ResourcesSkillsPopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ResourceSkillsService);
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
