import { Component, inject } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AppRoute } from "../../../../app.routes.enum";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { OrganizationStrategy } from "../../services/organization-strategy";
import { Strategy } from "../../models/strategy";
import { DatePickerModule } from "primeng/datepicker";
import { AutoCompleteModule } from "primeng/autocomplete";

@Component({
  selector: "app-add-edit",
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    RadioButtonModule,
    DatePickerModule,
    AutoCompleteModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrl: "./add-edit.scss",
})
export class AddEdit {
  private fb = inject(FormBuilder);
  private strategyService = inject(OrganizationStrategy);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  strategyId: number | null = null;
  organizationId: number | null = null;

  ngOnInit(): void {
    this.createForm();
    this.checkIfEditMode();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      year: [null, Validators.required],
      vision: ["", Validators.required],

      strategicScenarioId: [null, Validators.required],
      scenarioDescription: ["", Validators.required],

      assumptions: ["", Validators.required],
      strategicFocus: ["", Validators.required],
      description: ["", Validators.required],

      swot: this.fb.group({
        strengths: ["", Validators.required],
        weaknesses: ["", Validators.required],
        opportunities: ["", Validators.required],
        threats: ["", Validators.required],
      }),

      strategicGoals: [[], Validators.required],
    });
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.organizationId = +id;
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get("strategyId");
      if (id) {
        this.strategyId = +id;
        this.formGroup.addControl(
          "code",
          this.fb.control({ value: "", disabled: true })
        );
        this.formGroup.addControl(
          "organizationName",
          this.fb.control({ value: "", disabled: true })
        );

        this.loadStrategy(this.strategyId);
      }
    });
  }

  private loadStrategy(id: number): void {
    this.strategyService.getStrategyById(id).subscribe({
      next: (res: Strategy) => {
        this.formGroup.patchValue({
          code: res.code,
          organizationName: res.organizationName,
          year: res.year,
          vision: res.vision,
          strategicScenarioId: res.strategicScenarioId,
          scenarioDescription: res.scenarioDescription,
          assumptions: res.assumptions,
          strategicFocus: res.strategicFocus,
          description: res.description,

          swot: {
            strengths: res.swot?.strengths?.[0] ?? "",
            weaknesses: res.swot?.weaknesses?.[0] ?? "",
            opportunities: res.swot?.opportunities?.[0] ?? "",
            threats: res.swot?.threats?.[0] ?? "",
          },
        });

        if (res.strategicGoals?.length) {
          const strategicGoals = res.strategicGoals.map((g) => g.description);
          this.formGroup.get("strategicGoals")?.setValue(strategicGoals);
        }
      },
      error: () => {
        this.router.navigateByUrl(
          `${AppRoute.ORGANIZATIONS}/${this.organizationId}/${AppRoute.STRATEGIES}`
        );
      },
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.getRawValue();

    if (payload.year instanceof Date) {
      payload.year = payload.year.getFullYear();
    }

    if (payload.swot) {
      payload.swot = Object.entries(payload.swot).reduce(
        (acc, [key, value]) => {
          acc[key] = value ? [value as string] : [];
          return acc;
        },
        {} as Record<string, string[]>
      );
    }

    if (Array.isArray(payload.strategicGoals)) {
      payload.strategicGoals = payload.strategicGoals.map((goal: string) => ({
        title: "title",
        description: goal,
      }));
    }

    payload.organizationalUnitId = this.organizationId;

    const action$ = this.strategyId
      ? this.strategyService.updateStrategy(this.strategyId, payload)
      : this.strategyService.createStrategy(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Strategy saved successfully 🎉",
        });
        this.router.navigateByUrl(
          `${AppRoute.ORGANIZATIONS}/${this.organizationId}/${AppRoute.STRATEGIES}`
        );
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl(
      `${AppRoute.ORGANIZATIONS}/${this.organizationId}/${AppRoute.STRATEGIES}`
    );
  }
}
