import { Component, inject } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MessageService } from "primeng/api";

import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { TableModule } from "primeng/table";
import { AppRoute } from "../../../../app.routes.enum";
import { SelectModule } from "primeng/select";
import { RiskManagementService } from "../../services/risk-management-service";
import { TextareaModule } from "primeng/textarea";
import { ToggleButtonModule } from "primeng/togglebutton";
import { DatePickerModule } from "primeng/datepicker";
import { RiskManagementInterface } from "../../models/risk-management";

@Component({
  selector: "app-add-edit",
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    RadioButtonModule,
    TableModule,
    TextareaModule,
    ToggleButtonModule,
    DatePickerModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrl: "./add-edit.scss",
})
export class AddEdit {
  readonly today = new Date();
  private fb = inject(FormBuilder);
  private riskService = inject(RiskManagementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  riskId: number | null = null;

  dimensions: any[] = [];
  entities: any[] = [];
  accounts: any[] = [];
  rootCauses: any[] = [];
  riskCategories: any[] = [];
  rootCauseSubCategories: any[] = [];
  processGroups: any[] = [];

  statusOptions = [
    { label: "Open", value: 0 },
    { label: "In Progress", value: 1 },
    { label: "Closed", value: 2 },
  ];

  riskLevelOptions = [
    { label: "Process Group", value: 0 },
    { label: "Process", value: 1 },
    { label: "Activity", value: 2 },
    { label: "Task", value: 4 },
  ];

  mitigationOptions = [
    { label: "Mitigated", value: 0 },
    { label: "In Progress", value: 1 },
    { label: "Unmitigated", value: 2 },
  ];

  stateOptions = [
    { label: "Active", value: 0 },
    { label: "Archived", value: 1 },
  ];

  ngOnInit(): void {
    this.createForm();
    this.checkIfEditMode();
    this.loadDropdowns();
    this.setupReactiveWatchers();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      riskDriver: ["", Validators.required],
      riskEvent: ["", Validators.required],
      status: [0, Validators.required],
      consequences: [""],
      validity: ["", Validators.required],
      dimensionId: [null, Validators.required],
      entityId: [null, Validators.required],
      riskLevel: [null],
      rootCauseCategoryId: [null],
      rootCauseSubCategoryId: [null],
      riskCategoryId: [null, Validators.required],
      processId: [null],
      highPriorityRisk: [false],
      strategicRisk: [false],
      mitigationStatus: [0],
      riskOwnerId: [null],
      state: [0],
      notes: [""],
      riskKRIs: this.fb.array([]),
    });

    this.addKRI();
  }

  setupReactiveWatchers() {
    this.formGroup.get("entityId")?.valueChanges.subscribe(() => {
      this.loadProcessGroups();
    });

    this.formGroup.get("riskLevel")?.valueChanges.subscribe(() => {
      this.loadProcessGroups();
    });
  }

  get riskKRIsFormArray(): FormArray {
    return this.formGroup.get("riskKRIs") as FormArray;
  }

  addKRI(): void {
    this.riskKRIsFormArray.push(
      this.fb.group({
        id: [null],
        keyRiskIndicator: ["", Validators.required],
        riskAppetite: [""],
      })
    );
  }

  removeKRI(index: number): void {
    this.riskKRIsFormArray.removeAt(index);
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get("id");
      if (id) {
        this.riskId = +id;
        this.loadRisk(this.riskId);
      }
    });
  }

  private loadRisk(id: number): void {
    this.riskService.getRiskById(id).subscribe({
      next: (res) => {
        this.formGroup.patchValue({
          riskDriver: res.riskDriver,
          riskEvent: res.riskEvent,
          status: res.status,
          consequences: res.consequences,
          dimensionId: res.dimensionId,
          entityId: res.entityId,
          processId: res.processId,
          riskLevel: res.riskLevel,
          rootCauseCategoryId: res.rootCauseCategoryId,
          rootCauseSubCategoryId: res.rootCauseSubCategoryId,
          mitigationStatus: res.riskMitigationStatus ?? 0,
          riskOwnerId: res.riskOwnerId,
          state: res.status,
          notes: res.comments,
          riskCategoryId: res.riskCategoryId,
          highPriorityRisk: res.highPriorityRisk ?? false,
          strategicRisk: res.strategicRisk ?? false,
          validity: res.validity ? new Date(res.validity) : null,
        });

        if (res.rootCauseCategoryId) {
          this.loadRootCauseSubCategories(res.rootCauseCategoryId);
        }

        this.riskKRIsFormArray.clear();
        if (Array.isArray(res.riskKRIs) && res.riskKRIs.length) {
          res.riskKRIs.forEach((kri) => {
            this.riskKRIsFormArray.push(
              this.fb.group({
                id: [kri.id],
                keyRiskIndicator: [kri.keyRiskIndicator, Validators.required],
                riskAppetite: [kri.riskAppetite ?? ""],
              })
            );
          });
        } else {
          this.addKRI();
        }

        // trigger process group load if entity and riskLevel exist
        this.loadProcessGroups();
      },
      error: () => {
        this.router.navigateByUrl(AppRoute["RISK-MANAGEMENT"] || "/risks");
      },
    });
  }

  private loadDropdowns(): void {
    forkJoin({
      dimensions: this.riskService
        .getDimensionsLookUp()
        .pipe(catchError(() => of([]))),
      entities: this.riskService
        .getEntitiesLookUp()
        .pipe(catchError(() => of([]))),
      accounts: this.riskService
        .getUsersLookUp()
        .pipe(catchError(() => of([]))),
      rootCauses: this.riskService
        .getRiskRootCauses()
        .pipe(catchError(() => of([]))),
      riskCategories: this.riskService
        .getRiskCategoriesLookUp()
        .pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      this.dimensions = res.dimensions;
      this.entities = res.entities;
      this.accounts = res.accounts;
      this.rootCauses = res.rootCauses;
      this.riskCategories = res.riskCategories.items;
    });
  }

  onSelectRootCause(parentId: number): void {
    this.formGroup.patchValue({
      rootCauseCategoryId: parentId,
      rootCauseSubCategoryId: null,
    });
    this.loadRootCauseSubCategories(parentId);
  }

  private loadRootCauseSubCategories(parentId: number): void {
    if (!parentId) {
      this.rootCauseSubCategories = [];
      return;
    }

    this.riskService.loadRootCauseSubCategories(parentId).subscribe({
      next: (res) => {
        this.rootCauseSubCategories = res;
        console.log(this.rootCauseSubCategories);
      },
      error: () => {
        this.rootCauseSubCategories = [];
      },
    });
  }

  private loadProcessGroups(): void {
    const entityId = this.formGroup.get("entityId")?.value;
    const processType = this.formGroup.get("riskLevel")?.value;

    this.formGroup.patchValue({ processId: null });

    if (!entityId || !processType) {
      this.processGroups = [];
      return;
    }

    this.riskService.getProcessGroupLookup(entityId, processType).subscribe({
      next: (res) => (this.processGroups = res),
      error: () => (this.processGroups = []),
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const raw = this.formGroup.getRawValue();

    const payload: RiskManagementInterface = {
      riskDriver: raw.riskDriver,
      riskEvent: raw.riskEvent,
      status: raw.status,
      consequences: raw.consequences,
      dimensionId: raw.dimensionId,
      entityId: raw.entityId,
      riskLevel: raw.riskLevel || undefined,
      processId: raw.processId || undefined,
      rootCauseCategoryId: raw.rootCauseCategoryId,
      rootCauseSubCategoryId: raw.rootCauseSubCategoryId,
      riskMitigationStatus: raw.mitigationStatus,
      riskOwnerId: raw.riskOwnerId,
      comments: raw.notes,
      riskKRIs: raw.riskKRIs.map((k: any) => ({
        id: k.id,
        keyRiskIndicator: k.keyRiskIndicator,
        riskAppetite: k.riskAppetite,
      })),
      riskCategoryId: raw.riskCategoryId,
      highPriorityRisk: raw.highPriorityRisk,
      strategicRisk: raw.strategicRisk,
      validity: raw.validity,
    };

    const action$ = this.riskId
      ? this.riskService.updateRisk(this.riskId, payload)
      : this.riskService.createRisk(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Risk saved successfully 🎉",
        });
        this.router.navigateByUrl(AppRoute["RISK-MANAGEMENT"] || "/risks");
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save risk",
        });
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl(AppRoute["RISK-MANAGEMENT"] || "/risks");
  }
}
