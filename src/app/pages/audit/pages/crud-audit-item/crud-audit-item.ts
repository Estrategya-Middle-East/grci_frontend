import { Component, effect, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Select, SelectModule } from 'primeng/select';
import { EntitiesItem } from '../../models/interfaces/audit-entities';
import { AuditCategory } from '../../models/interfaces/audit-categories';
import { FrequencyData } from '../../models/interfaces/audit-frequancy';
import { lookup } from '../../../../shared/models/lookup.mdoel';
import { AuditItem } from '../../models/interfaces/audit-item';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-crud-audit-item',
  standalone:true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RadioButtonModule,   // ✅ Added
    ButtonModule,        // ✅ Added
    InputTextModule,     // ✅ Added if needed
    TextareaModule,
    SelectModule],
  templateUrl: './crud-audit-item.html',
  styleUrl: './crud-audit-item.scss'
})
export class CrudAuditItem {
auditForm!: FormGroup;
  state = signal<string>('active');
  showDebug = false; // Set to true to see form values
  
  // Temporary values for adding new items
  newRiskValue = '';
  newFrameworkValue = '';

  // Dropdown options signals
  dimensionOptions = signal<AuditItem[]>([
    
  ]);

  entityOptions = signal<EntitiesItem[]>([
   
  ]);

  categoryOptions = signal<AuditCategory[]>([
    
  ]);

  frequencyOptions = signal<FrequencyData[]>([
    
  ]);

  ownerOptions = signal<lookup[]>([
   
  ]);

  constructor(private fb: FormBuilder) {
    // Effect to sync state signal with form
    effect(() => {
      if (this.auditForm) {
        this.auditForm.patchValue({ state: this.state() }, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.auditForm = this.fb.group({
      code: ['C-001', Validators.required],
      auditItemName: ['', Validators.required],
      description: [''],
      dimension: [null, Validators.required],
      entity: [null, Validators.required],
      risks: this.fb.array([
        this.fb.control('X value risk')
      ]),
      priorityLevel: ['', Validators.required],
      estimatedEffort: ['', Validators.required],
      auditCategory: [null, Validators.required],
      auditFrequency: [null, Validators.required],
      auditOwner: [null],
      status: ['new', Validators.required],
      state: ['active', Validators.required],
      frameworks: this.fb.array([
        this.fb.control('x Framework', Validators.required)
      ], Validators.required),
      comments: ['']
    });
  }

  // Getters for FormArrays
  get risks(): FormArray {
    return this.auditForm.get('risks') as FormArray;
  }

  get frameworks(): FormArray {
    return this.auditForm.get('frameworks') as FormArray;
  }

  // Risk Management
  addRisk() {
    if (this.newRiskValue.trim()) {
      this.risks.push(this.fb.control(this.newRiskValue.trim()));
      this.newRiskValue = '';
    }
  }

  removeRisk(index: number) {
    this.risks.removeAt(index);
  }

  // Framework Management
  addFramework() {
    if (this.newFrameworkValue.trim()) {
      this.frameworks.push(this.fb.control(this.newFrameworkValue.trim(), Validators.required));
      this.newFrameworkValue = '';
    }
  }

  removeFramework(index: number) {
    if (this.frameworks.length > 1) {
      this.frameworks.removeAt(index);
    }
  }

  // State Management
  setState(value: string) {
    this.state.set(value);
    this.auditForm.patchValue({ state: value });
  }

  // Form Actions
  onSave() {
    if (this.auditForm.valid) {
      const formData = this.auditForm.value;
      console.log('Form Data:', formData);
      
      // Here you would typically send the data to your backend service
      // this.auditService.createAuditItem(formData).subscribe(...)
      
      alert('Audit item saved successfully!');
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.auditForm.controls).forEach(key => {
        this.auditForm.get(key)?.markAsTouched();
      });
      alert('Please fill all required fields');
    }
  }

  onCancel() {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.auditForm.reset({
        code: 'C-001',
        status: 'new',
        state: 'active'
      });
      
      // Reset form arrays
      this.risks.clear();
      this.risks.push(this.fb.control('X value risk'));
      
      this.frameworks.clear();
      this.frameworks.push(this.fb.control('x Framework', Validators.required));
      
      this.state.set('active');
    }
  }
}
