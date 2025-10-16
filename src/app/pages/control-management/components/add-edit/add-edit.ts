import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { DatePickerModule } from "primeng/datepicker";
import { Select } from "primeng/select";
import { MultiSelectModule } from "primeng/multiselect";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { MessageService } from "primeng/api";
import { catchError, forkJoin, of } from "rxjs";
import { ControlPayload } from "../../models/control-management";
import { ControlManagementService } from "../../services/control-management";
import { lookup } from "../../../../shared/models/lookup.mdoel";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    Select,
    MultiSelectModule,
    HeaderComponent,
  ],
  templateUrl: "./add-edit.html",
  styleUrls: ["./add-edit.scss"],
})
export class AddEdit implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private controlService = inject(ControlManagementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  formGroup!: FormGroup;
  controlId: number | null = null;
  switchStatus = signal<"draft" | "active">("draft");

  // Dropdown signals
  categories = signal<lookup[]>([]);
  significances = signal<lookup[]>([]);
  automations = signal<lookup[]>([]);
  natures = signal<lookup[]>([]);
  risks = signal<lookup[]>([]);

  // Names for edit mode
  controlCategoryName?: string;
  controlSignificanceName?: string;
  controlAutomationName?: string;
  controlNatureName?: string;

  ngOnInit(): void {
    this.createForm();
    this.loadDropdownData();
    this.checkIfEditMode();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      name: ["", Validators.required],
      controlObjective: ["", Validators.required],
      description: ["", Validators.required],
      validityFrom: ["", Validators.required],
      validityTo: ["", Validators.required],
      controlCategoryId: ["", Validators.required],
      controlSignificanceId: ["", Validators.required],
      controlAutomationId: ["", Validators.required],
      controlNatureId: ["", Validators.required],
      riskIds: [[], Validators.required],
      status: ["draft", Validators.required],
    });

    // Reset validityTo if validityFrom changes
    this.formGroup.get("validityFrom")?.valueChanges.subscribe((fromDate) => {
      const toControl = this.formGroup.get("validityTo");
      const toDate = toControl?.value;

      // Reset if previously selected To date is before new From date
      if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
        toControl?.reset();
      }
    });
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.controlId = +id;
        this.loadControl(this.controlId);
      }
    });
  }

  private loadControl(id: number): void {
    this.controlService.getControlById(id).subscribe({
      next: (control) => {
        this.formGroup.patchValue({
          name: control.name,
          controlObjective: control.controlObjective,
          description: control.description,
          validityFrom: control.validityFrom
            ? new Date(control.validityFrom)
            : null,
          validityTo: control.validityTo ? new Date(control.validityTo) : null,
          controlCategoryId: control.controlCategoryId,
          controlSignificanceId: control.controlSignificanceId,
          controlAutomationId: control.controlAutomationId,
          controlNatureId: control.controlNatureId,
          riskIds: control.risks?.map((r: any) => r.id) ?? [],
          status: control.status === 1 ? "active" : "draft",
        });

        this.switchStatus.set(control.status === 1 ? "active" : "draft");

        this.controlCategoryName = control.controlCategoryName;
        this.controlSignificanceName = control.controlSignificanceName;
        this.controlAutomationName = control.controlAutomationName;
        this.controlNatureName = control.controlNatureName;
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load control data",
        });
        this.router.navigateByUrl("/control-management");
      },
    });
  }

  private loadDropdownData(): void {
    forkJoin({
      categories: this.controlService
        .getControlCategoriesLookup()
        .pipe(catchError(() => of([]))),
      significances: this.controlService
        .getControlSignificancesLookup()
        .pipe(catchError(() => of([]))),
      automations: this.controlService
        .getControlAutomationsLookup()
        .pipe(catchError(() => of([]))),
      natures: this.controlService
        .getControlNaturesLookup()
        .pipe(catchError(() => of([]))),
      risks: this.controlService.getRisks().pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      this.categories.set(res.categories);
      this.significances.set(res.significances);
      this.automations.set(res.automations);
      this.natures.set(res.natures);
      this.risks.set(res.risks);
    });
  }

  toggleStatus(value: "draft" | "active"): void {
    this.switchStatus.set(value);
    this.formGroup.patchValue({ status: value });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formValue = this.formGroup.value;
    const payload: ControlPayload = {
      id: this.controlId || undefined,
      name: formValue.name,
      description: formValue.description,
      controlObjective: formValue.controlObjective,
      validityFrom: formValue.validityFrom,
      validityTo: formValue.validityTo,
      controlCategoryId: formValue.controlCategoryId,
      controlSignificanceId: formValue.controlSignificanceId,
      controlAutomationId: formValue.controlAutomationId,
      controlNatureId: formValue.controlNatureId,
      riskIds: formValue.riskIds,
      status: formValue.status === "active" ? 1 : 0,

      controlCategoryName: this.controlCategoryName,
      controlSignificanceName: this.controlSignificanceName,
      controlAutomationName: this.controlAutomationName,
      controlNatureName: this.controlNatureName,
    };

    const action$ = this.controlId
      ? this.controlService.updateControl(this.controlId, payload)
      : this.controlService.createControl(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: `Control ${
            this.controlId ? "updated" : "created"
          } successfully 🎉`,
        });
        this.router.navigateByUrl("/control-management");
      },
      error: (err) => {
        console.error("❌ Failed to save control:", err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save control 😞",
        });
      },
    });
  }
}
