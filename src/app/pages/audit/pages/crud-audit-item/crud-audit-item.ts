import { Component, effect, inject, signal } from '@angular/core';
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
import { AuditItemService } from '../../services/auditItem/audit-item-service';
import {  MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { AddDialog } from '../../components/dialogs/add-dialog/add-dialog';
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
    SelectModule,
    MultiSelectModule,
    ToastModule],
    providers:[DialogService],
  templateUrl: './crud-audit-item.html',
  styleUrl: './crud-audit-item.scss'
})
export class CrudAuditItem {
private messageService = inject(MessageService);
private dialogService = inject(DialogService);

auditForm!: FormGroup;
  state = signal<string>('active');
  showDebug = false; // Set to true to see form values
  
  // Temporary values for adding new items
  newRiskValue = '';
  newFrameworkValue = '';

  // Dropdown options signals
 

  constructor(private fb: FormBuilder,public auditService:AuditItemService) {
    // Effect to sync state signal with form
    effect(() => {
      if (this.auditForm) {
        this.auditForm.patchValue({ state: this.state() }, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.auditService.getAllFiltersDropDowns().subscribe()
  }

  initForm() {
        this.auditForm = this.fb.group({
        title: ['', Validators.required],
        description: [''],
        dimensionId: [null, Validators.required],
        entityId: [null, Validators.required],
        riskIds: [[]], // array of IDs
        priority: [null, Validators.required],
        estimatedEffort: [null, Validators.required],
        auditCategoryId: [null, Validators.required],
        auditFrequencyId: [null, Validators.required],
        auditOwnerId: [null],
        regulatoryFrameworks: ['', Validators.required],
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
      
      // Here you would typically send the data to your backend service
      this.auditService.createAuditItem(formData).subscribe({
        next:(res)=>{
          this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          },error:(err)=>{
          this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: err.error.error[0],
            });

        }
      })      
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
   onAddcategory() {
      const ref = this.dialogService.open(AddDialog, {
        header: "Add Audit Categories",
        width: "600px",
        modal: true,
      });
      
      ref.onClose.subscribe((result) => {
        if (result) {
          
          this.auditService.addCategory(result.value).subscribe({
            next:(res)=>{

              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
             this.auditService.getAllFiltersDropDowns().subscribe()
            },error:(err:HttpErrorResponse)=>{
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: err.error.error[0],
              });
              
            }
          })
        }
      });
    }
}
