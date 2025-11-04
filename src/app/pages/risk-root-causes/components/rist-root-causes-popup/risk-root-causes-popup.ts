import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { DynamicDialogRef, DynamicDialogConfig } from "primeng/dynamicdialog";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { tap } from "rxjs/operators";
import { RiskRootCausesService } from "../../services/risk-root-causes";
import { RiskRootCauseInterface } from "../../models/risk-root-causes";

@Component({
  selector: "app-risk-root-cause-popup",
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, SelectModule],
  templateUrl: "./risk-root-causes-popup.html",
  styleUrl: "./risk-root-causes-popup.scss",
})
export class RiskRootCausePopup implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(RiskRootCausesService);
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  formGroup!: FormGroup;
  mainCategories: lookup[] = [];
  subCategories: lookup[] = [];

  ngOnInit(): void {
    const data = this.config.data as RiskRootCauseInterface | undefined;

    console.log(data);

    this.formGroup = this.fb.group({
      id: [{ value: data?.id ?? null, disabled: true }],
      rootCause: [data?.rootCause ?? "", Validators.required],
      parent: [data?.parent ?? null, Validators.required],
      subCategory: [null, Validators.required],
    });

    this.loadMainCategories();

    this.formGroup.get("parent")?.valueChanges.subscribe((parentId) => {
      if (parentId) {
        this.loadSubCategories(parentId);
      } else {
        this.subCategories = [];
        this.formGroup.patchValue({ subCategory: null });
      }
    });

    if (data?.parent) {
      this.loadSubCategories(data.parent);
    }
  }

  private loadMainCategories() {
    this.service
      .getMainCategoriesLookup()
      .pipe(tap((res) => (this.mainCategories = res)))
      .subscribe();
  }

  private loadSubCategories(parentId: number) {
    this.service
      .getSubCategories(parentId)
      .pipe(tap((res) => (this.subCategories = res)))
      .subscribe();
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const rawValue = this.formGroup.getRawValue();

    const request$ = rawValue.id
      ? this.service.update(rawValue.id, rawValue)
      : this.service.create(rawValue);

    request$.subscribe(() => this.dialogRef.close(true));
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
