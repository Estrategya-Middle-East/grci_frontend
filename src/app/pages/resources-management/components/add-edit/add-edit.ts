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
import { SelectModule } from "primeng/select";
import { MultiSelectModule } from "primeng/multiselect";
import { AutoCompleteModule } from "primeng/autocomplete";
import { DatePickerModule } from "primeng/datepicker";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { AppRoute } from "../../../../app.routes.enum";
import { ResourceService } from "../../services/resource";
import {
  formatTimeOnly,
  parseTimeString,
} from "../../../../shared/utils/parse-time";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-add-edit",
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    TableModule,
    SelectModule,
    MultiSelectModule,
    AutoCompleteModule,
    DatePickerModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrl: "./add-edit.scss",
})
export class AddEdit {
  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  resourceId: number | null = null;

  functions: lookup[] = [];
  skills: lookup[] = [];
  accounts: lookup[] = [];

  ngOnInit(): void {
    this.createForm();
    this.checkIfEditMode();
    this.loadDropdowns();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      resourceFunctionId: [null, Validators.required],
      resourceName: ["", Validators.required],
      skills: [null, Validators.required],
      userId: [null, Validators.required],
      workingHoursFrom: [null, Validators.required],
      workingHoursTo: [null, Validators.required],
      experiences: this.fb.array([]),
    });
    this.addExperience();
  }

  get experiencesFormArray() {
    return this.formGroup.get("experiences") as FormArray;
  }

  addExperience(): void {
    this.experiencesFormArray.push(
      this.fb.group({
        id: [null],
        experienceName: ["", Validators.required],
        numberOfYears: [1, [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeExperience(index: number): void {
    this.experiencesFormArray.removeAt(index);
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get("resourceId");
      if (id) {
        this.resourceId = +id;
        this.formGroup.addControl(
          "code",
          this.fb.control({ value: "", disabled: true })
        );
        this.loadResource(this.resourceId);
      }
    });
  }

  private loadResource(id: number): void {
    this.resourceService.getResourceById(id).subscribe({
      next: (res) => {
        this.formGroup.patchValue({
          code: res.code,
          resourceFunctionId: res.resourceFunctionId,
          resourceName: res.resourceName,
          skills: res.skills.map((s: any) => s.resourceSkillId),
          userId: res.userId,
          workingHoursFrom: parseTimeString(res.workingHoursFrom),
          workingHoursTo: parseTimeString(res.workingHoursTo),
        });

        this.experiencesFormArray.clear();
        res.experiences.forEach((exp) => {
          this.experiencesFormArray.push(
            this.fb.group({
              id: [exp.id],
              experienceName: [exp.experienceName, Validators.required],
              numberOfYears: [
                exp.numberOfYears,
                [Validators.required, Validators.min(0)],
              ],
            })
          );
        });
      },
      error: () => {
        this.router.navigateByUrl(AppRoute["RESOURCES-MANAGEMENT"]);
      },
    });
  }

  private loadDropdowns(): void {
    forkJoin({
      functions: this.resourceService
        .getResourceFunctionsLookUp()
        .pipe(catchError(() => of([]))),
      skills: this.resourceService
        .getResourceSkillsLookUp()
        .pipe(catchError(() => of([]))),
      accounts: this.resourceService
        .getUsersLookUp()
        .pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      this.functions = res.functions;
      this.skills = res.skills;
      this.accounts = res.accounts;
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.getRawValue();
    payload.skills = payload.skills?.map((s: any) => s.id ?? s) ?? [];
    payload.workingHoursFrom = formatTimeOnly(payload.workingHoursFrom);
    payload.workingHoursTo = formatTimeOnly(payload.workingHoursTo);

    const action$ = this.resourceId
      ? this.resourceService.updateResource(this.resourceId, payload)
      : this.resourceService.createResource(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Resource saved successfully 🎉",
        });
        this.router.navigateByUrl(AppRoute["RESOURCES-MANAGEMENT"]);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl(AppRoute["RESOURCES-MANAGEMENT"]);
  }
}
