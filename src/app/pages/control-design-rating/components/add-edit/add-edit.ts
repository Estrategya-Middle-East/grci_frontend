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
import { InputNumberModule } from "primeng/inputnumber";
import { TextareaModule } from "primeng/textarea";
import { DatePickerModule } from "primeng/datepicker";
import { ButtonModule } from "primeng/button";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { MessageService } from "primeng/api";
import { ControlDesignRatingService } from "../../services/control-design-rating";
import { ControlRiskRating } from "../../models/control-design-rating";
import { catchError, forkJoin, of } from "rxjs";
import { lookup } from "@shared/models/lookup.model";
import { SelectModule } from "primeng/select";
import { appRoutes } from "../../../../app.routes.enum";

@Component({
  selector: "add-edit",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    DatePickerModule,
    ButtonModule,
    HeaderComponent,
    SelectModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrls: ["./add-edit.scss"],
})
export class AddEdit implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ControlDesignRatingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  totalWeight = 0;

  formGroup!: FormGroup;
  controlRatingId: number | null = null;
  risksOptions!: lookup[];
  controlsOptions!: lookup[];

  ngOnInit(): void {
    this.loadDropdowns();
    this.createForm();
    this.checkEditMode();
  }

  private loadDropdowns(): void {
    forkJoin({
      controls: this.service.getControlsLookup().pipe(catchError(() => of([]))),
      risks: this.service.getRisksLookup().pipe(catchError(() => of([]))),
    }).subscribe((res) => {
      this.risksOptions = res.risks;
      this.controlsOptions = res.controls;
    });
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      controlRiskId: ["", Validators.required],
      sensitivity: [0, Validators.required],
      sensitivityWeight: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      reliability: [0, Validators.required],
      reliabilityWeight: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      verifiability: [0, Validators.required],
      verifiabilityWeight: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      override: [0, Validators.required],
      overrideWeight: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      correction: [0, Validators.required],
      correctionWeight: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      competence: [0, Validators.required],
      competenceWeight: [
        0,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
      remarks: ["", Validators.maxLength(500)],
      ratingDate: [null, Validators.required],
    });

    this.formGroup.valueChanges.subscribe(() => this.updateTotalWeight());
  }

  updateTotalWeight() {
    const weights = [
      this.formGroup.get("sensitivityWeight")?.value || 0,
      this.formGroup.get("reliabilityWeight")?.value || 0,
      this.formGroup.get("verifiabilityWeight")?.value || 0,
      this.formGroup.get("overrideWeight")?.value || 0,
      this.formGroup.get("correctionWeight")?.value || 0,
      this.formGroup.get("competenceWeight")?.value || 0,
    ];

    this.totalWeight = weights.reduce((sum, val) => sum + parseFloat(val), 0);

    // Optionally mark the form invalid if sum ≠ 1
    if (Math.abs(this.totalWeight - 1) > 0.001) {
      this.formGroup.setErrors({ invalidWeightSum: true });
    } else {
      this.formGroup.setErrors(null);
    }
  }

  private checkEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.controlRatingId = +id;
        this.loadControlRating(this.controlRatingId);
      }
    });
  }

  private loadControlRating(id: number): void {
    this.service.getById(id).subscribe({
      next: (rating) => {
        this.formGroup.patchValue({
          controlRiskId: rating.controlRiskId,
          sensitivity: rating.sensitivity,
          sensitivityWeight: rating.sensitivityWeight,
          reliability: rating.reliability,
          reliabilityWeight: rating.reliabilityWeight,
          verifiability: rating.verifiability,
          verifiabilityWeight: rating.verifiabilityWeight,
          override: rating.override,
          overrideWeight: rating.overrideWeight,
          correction: rating.correction,
          correctionWeight: rating.correctionWeight,
          competence: rating.competence,
          competenceWeight: rating.competenceWeight,
          remarks: rating.remarks,
          ratingDate: rating.ratingDate ? new Date(rating.ratingDate) : null,
        });
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load control rating",
        });
        this.router.navigateByUrl("/control-design-rating");
      },
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload: Omit<ControlRiskRating, "id"> = this.formGroup.value;

    const action$ = this.controlRatingId
      ? this.service.update(this.controlRatingId, {
          ...payload,
          id: this.controlRatingId,
        })
      : this.service.create(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: `Control Design Rating ${
            this.controlRatingId ? "updated" : "created"
          } successfully`,
        });
        this.router.navigateByUrl(`/${appRoutes["CONTROL-DESIGN-RATING"]}`);
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save control rating",
        });
      },
    });
  }
}
