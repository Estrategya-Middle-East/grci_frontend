import { Component, ViewChild, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";

import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { AppRoute } from "../../../../app.routes.enum";
import { ResourcesPerformanceService } from "../../services/resources-performance-service";
import { SelectModule } from "primeng/select";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { catchError, forkJoin, of } from "rxjs";

@Component({
  selector: "add-edit",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TableModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrl: "./add-edit.scss",
})
export class AddEdit implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ResourcesPerformanceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  performanceId: number | null = null;

  competencyOptions!: lookup[];
  resourcesOptions!: lookup[];
  workingPaperOptions!: lookup[];

  ngOnInit(): void {
    this.loadDropdowns();
    this.createForm();
    this.checkIfEditMode();
  }

  private loadDropdowns(): void {
    forkJoin({
      resources: this.service
        .getResourcesLookup()
        .pipe(catchError(() => of([]))),
      competencies: this.service
        .getCompetancyLookup()
        .pipe(catchError(() => of([]))),
      workingPapers: this.service
        .getWorkingPapersLookup()
        .pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      this.resourcesOptions = res.resources;
      this.competencyOptions = res.competencies;
      this.workingPaperOptions = res.workingPapers;
    });
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      id: [{ value: null, disabled: true }],
      resourceId: ["", Validators.required],
      workingPaperId: ["", Validators.required],
      comments: ["", Validators.required],
      ratings: this.fb.array([]),
      // finalEvaluation: ["", Validators.required],
    });
    this.addCompetency();
  }

  get competenciesFormArray() {
    return this.formGroup.get("ratings") as FormArray;
  }

  addCompetency(): void {
    this.competenciesFormArray.push(
      this.fb.group({
        competencyFrameworkId: ["", Validators.required],
        ratingValue: ["", Validators.required],
        comments: ["", Validators.required],
      })
    );
  }

  removeCompetency(index: number): void {
    this.competenciesFormArray.removeAt(index);
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get("id");
      if (id) {
        this.performanceId = +id;
        this.loadPerformance(this.performanceId);
      }
    });
  }

  private loadPerformance(id: number) {
    this.service.getById(id).subscribe({
      next: (res) => {
        this.formGroup.patchValue({
          id: res.id,
          resourceId: res.resourceId,
          workingPaperId: res.workingPaperId,
          comments: res.comments,
          // finalEvaluation: res.finalEvaluation,
        });

        // Load competencies
        this.competenciesFormArray.clear();
        res.ratings.forEach((c: any) => {
          this.competenciesFormArray.push(
            this.fb.group({
              competencyFrameworkId: [
                c.competencyFrameworkId,
                Validators.required,
              ],
              ratingValue: [c.ratingValue, Validators.required],
              comments: [c.comments, Validators.required],
            })
          );
        });
      },
      error: () => {
        this.router.navigateByUrl(AppRoute["RESOURCES-PERFORMANCE-RATING"]);
      },
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.getRawValue();
    const action$ = this.performanceId
      ? this.service.update(this.performanceId, payload)
      : this.service.create(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Resource Performance saved successfully 🎉",
        });
        this.router.navigateByUrl(AppRoute["RESOURCES-PERFORMANCE-RATING"]);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl(AppRoute["RESOURCES-PERFORMANCE-RATING"]);
  }
}
