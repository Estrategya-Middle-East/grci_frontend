import { Component, inject } from "@angular/core";
import { AppRoute } from "../../../../app.routes.enum";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Entity } from "../../services/entity";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from "primeng/textarea";
import { SelectModule } from "primeng/select";
import { lookup } from "../../../../shared/models/lookup.mdoel";
import { catchError, combineLatest, forkJoin, of } from "rxjs";

@Component({
  selector: "app-add-edit",
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
  ],
  templateUrl: "./add-edit.html",
  styleUrl: "./add-edit.scss",
})
export class AddEdit {
  private fb = inject(FormBuilder);
  private entityService = inject(Entity);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  entityId: number | null = null;

  dimensions: lookup[] = [];
  organizationalUnits: lookup[] = [];
  orgChartLevels: lookup[] = [];
  parentEntities: lookup[] = [];

  ngOnInit(): void {
    this.createForm();
    this.checkIfEditMode();
    this.loadDropdowns();
    combineLatest([
      this.formGroup.get("organizationId")!.valueChanges,
      this.formGroup.get("orgChartLevelId")!.valueChanges,
    ]).subscribe(([orgId, levelId]) => {
      if (orgId && levelId) {
        this.loadPotentialParents(orgId, levelId);
      } else {
        this.parentEntities = [];
        this.formGroup.patchValue({ parentId: null });
      }
    });
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      dimensionId: [null, Validators.required],
      organizationId: [null, Validators.required],
      name: ["", Validators.required],
      orgChartLevelId: [null, Validators.required],
      parentId: [null, Validators.required],
      introduction: ["", Validators.required],
      objectives: ["", Validators.required],
      description: ["", Validators.required],
    });
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get("entityId");
      if (id) {
        this.entityId = +id;
        this.formGroup.addControl(
          "code",
          this.fb.control({ value: "", disabled: true })
        );
        this.loadEntity(this.entityId);
      }
    });
  }

  private loadEntity(id: number): void {
    this.entityService.getEntityById(id).subscribe({
      next: (res: any) => {
        this.formGroup.patchValue({
          code: res.code,
          dimensionId: res.dimensionId,
          organizationId: res.organizationId,
          name: res.name,
          orgChartLevelId: res.orgChartLevelId,
          parentId: res.parentId,
          introduction: res.introduction,
          objectives: res.objectives,
          description: res.description,
        });
      },
      error: () => {
        this.router.navigateByUrl(AppRoute.ENTITIES);
      },
    });
  }

  private loadDropdowns(): void {
    forkJoin({
      dimensions: this.entityService.getDimensionsLookUp().pipe(
        catchError((err) => {
          console.error("Failed to load dimensions", err);
          return of([]);
        })
      ),
      organizationalUnits: this.entityService
        .getOrganizationalUnitLookUp()
        .pipe(
          catchError((err) => {
            console.error("Failed to load organizational units", err);
            return of([]);
          })
        ),
      orgChartLevels: this.entityService.getOrgChartLevels().pipe(
        catchError((err) => {
          console.error("Failed to load org chart levels", err);
          return of([]);
        })
      ),
    }).subscribe((res) => {
      this.dimensions = res.dimensions;
      this.organizationalUnits = res.organizationalUnits;
      this.orgChartLevels = res.orgChartLevels;
    });
  }

  private loadPotentialParents(orgId: number, levelId: number): void {
    this.entityService
      .getPotentialParents(orgId, levelId)
      .pipe(
        catchError((err) => {
          console.error("Failed to load parent entities", err);
          return of([]);
        })
      )
      .subscribe((res) => {
        this.parentEntities = res;
        if (
          !this.parentEntities.some(
            (p) => p.id === this.formGroup.get("parentId")?.value
          )
        ) {
          this.formGroup.patchValue({ parentId: null });
        }
      });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.getRawValue();

    const action$ = this.entityId
      ? this.entityService.updateEntity(this.entityId, payload)
      : this.entityService.createEntity(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Entity saved successfully 🎉",
        });
        this.router.navigateByUrl(AppRoute.ENTITIES);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl(AppRoute.ENTITIES);
  }
}
