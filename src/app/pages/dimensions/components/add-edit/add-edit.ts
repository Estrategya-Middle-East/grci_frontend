import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DimensionsService } from '../../services/dimensions.service';
import { AppRoute } from '../../../../app.routes.enum';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-add-edit',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './add-edit.html',
  styleUrl: './add-edit.scss',
})
export class AddEdit {
  private fb = inject(FormBuilder);
  private dimensionsService = inject(DimensionsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  formGroup!: FormGroup;
  dimensionId: number | null = null;

  ngOnInit(): void {
    this.createForm();
    this.checkIfEditMode();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  private checkIfEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.formGroup.addControl(
          'code',
          this.fb.control({ value: '', disabled: true })
        );
        this.dimensionId = +id;
        this.loadDimension(this.dimensionId);
      }
    });
  }

  private loadDimension(id: number): void {
    this.dimensionsService.getDimensionById(id).subscribe({
      next: (res) => {
        this.formGroup.patchValue({
          code: res.code,
          title: res.title,
          description: res.description,
        });
      },
      error: () => {
        this.router.navigateByUrl(`${AppRoute.DIMENSIONS}`);
      },
    });
  }

  onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.formGroup.value;

    const action$ = this.dimensionId
      ? this.dimensionsService.updateDimension(this.dimensionId, payload)
      : this.dimensionsService.createDimension(payload);

    action$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Dimension saved successfully 🎉',
        });

        this.router.navigateByUrl(`${AppRoute.DIMENSIONS}`);
      },
    });
  }
}
