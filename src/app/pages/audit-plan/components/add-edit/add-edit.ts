import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { catchError, forkJoin, of } from "rxjs";

import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { AppRoute } from "../../../../app.routes.enum";
import { AuditPlanService } from "../../services/audit-plan-service";
import { DatePickerModule } from "primeng/datepicker";
import { RadioButtonModule } from "primeng/radiobutton";
import { AutoCompleteModule } from "primeng/autocomplete";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TableModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    RadioButtonModule,
    AutoCompleteModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrl: "./add-edit.scss",
})
export class AddEdit implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(AuditPlanService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  auditPlanId: number | null = null;

  auditCycleOptions!: lookup[];
  engagementOptions!: { id: number; description: string }[];
  auditItemsOptions!: lookup[];
  // dimensionOptions!: lookup[];
  // entityOptions!: lookup[];

  ngOnInit(): void {
    this.loadDropdowns();
    this.createForm();
    this.checkIfEditMode();
  }

  private loadDropdowns(): void {
    forkJoin({
      auditCycles: of([{ id: 1, name: "Cycle 1", value: "" }]),
      engagements: this.service
        .getAuditEngagementsLookUp()
        .pipe(catchError(() => of([]))),
      auditItems: this.service
        .getAuditItemsLookup()
        .pipe(catchError(() => of([]))),
      // dimensions: this.service
      //   .getDimensionsLookUp()
      //   .pipe(catchError(() => of([]))),
      // entities: this.service.getEntitiesLookUp().pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      console.log(res);

      this.auditCycleOptions = res.auditCycles;
      this.engagementOptions = res.engagements;
      this.auditItemsOptions = res.auditItems;
      // this.dimensionOptions = res.dimensions;
      // this.entityOptions = res.entities;
    });
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      id: [{ value: null, disabled: true }],
      auditCycleId: ["", Validators.required],
      engagementId: ["", Validators.required],
      // dimensionId: ["", Validators.required],
      // entityId: ["", Validators.required],
      title: ["", Validators.required],
      remarks: [""],
      auditScope: ["", Validators.required],
      auditObjectives: ["", Validators.required],
      strategicFramework: ["", Validators.required],
      year: ["", Validators.required],
      status: ["scheduled", Validators.required],
      auditPlanItems: this.fb.array([]),
    });

    this.addAuditItem();
  }

  get auditItemsFormArray() {
    return this.formGroup.get("auditPlanItems") as FormArray;
  }

  addAuditItem(): void {
    this.auditItemsFormArray.push(
      this.fb.group({
        auditItemId: ["", Validators.required],
        scope: ["", Validators.required],
        objective: ["", Validators.required],
        auditApproach: ["", Validators.required],
        keyFocusAreas: [[], Validators.required],
        allocatedResources: ["", Validators.required],
        managementFocusPoints: ["", Validators.required],
      })
    );
  }

  removeAuditItem(index: number): void {
    this.auditItemsFormArray.removeAt(index);
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get("id");
      if (id) {
        this.auditPlanId = +id;
        this.loadAuditPlan(this.auditPlanId);
      }
    });
  }

  private loadAuditPlan(id: number) {
    this.service.getById(id).subscribe({
      next: (res) => {
        this.formGroup.patchValue({
          id: res.id,
          auditCycleId: res.auditCycleId,
          engagementId: res.engagementId,
          // dimensionId: res.auditItems?.[0]?.dimensionName || "",
          // entityId: res.auditItems?.[0]?.entityName || "",
          title: res.title,
          remarks: res.remarks,
          auditScope: res.auditScope,
          auditObjectives: res.auditObjectives,
          strategicFramework: res.strategicFramework,
          year: res.year ? new Date(res.year, 0, 1) : null,
          status: res.statusName?.toLowerCase() || "scheduled",
        });

        this.auditItemsFormArray.clear();
        res.auditItems.forEach((item) => {
          this.auditItemsFormArray.push(
            this.fb.group({
              auditItemId: [item.auditItemId, Validators.required],
              scope: [item.scope, Validators.required],
              objective: [item.objective, Validators.required],
              auditApproach: [item.auditApproach, Validators.required],
              keyFocusAreas: [item.keyFocusAreas, Validators.required],
              allocatedResources: [
                item.allocatedResources,
                Validators.required,
              ],
              managementFocusPoints: [
                item.managementFocusPoints,
                Validators.required,
              ],
            })
          );
        });
      },
      error: () => {
        this.router.navigateByUrl(AppRoute["AUDIT-PLAN"]);
      },
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.getRawValue();
    payload.year = payload.year.getFullYear();
    const action$ = this.auditPlanId
      ? this.service.update(this.auditPlanId, payload)
      : this.service.create(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Audit Plan saved successfully 🎉",
        });
        this.router.navigateByUrl(AppRoute["AUDIT-PLAN"]);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl(AppRoute["AUDIT-PLAN"]);
  }
}
