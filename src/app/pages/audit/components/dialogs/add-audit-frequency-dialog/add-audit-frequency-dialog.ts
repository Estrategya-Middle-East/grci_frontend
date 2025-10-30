import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageLocationItem } from '../../../models/interfaces/location-storage';
import { AuditItemService } from '../../../services/auditItem/audit-item-service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { RiskItem } from '../../../models/interfaces/audit-risks';

@Component({
  selector: 'app-add-audit-frequency-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RadioButtonModule,   // ✅ Added
    ButtonModule,        // ✅ Added
    InputTextModule,     // ✅ Added if needed
    MultiSelectModule,
    ToastModule,
    SelectModule,
    TextareaModule
  ],
  templateUrl: './add-audit-frequency-dialog.html',
  styleUrl: './add-audit-frequency-dialog.scss'
})
export class AddAuditFrequencyDialog {
 private dialogRef = inject(DynamicDialogRef);
  frequancyForm!: FormGroup;
  riskRatingList:RiskItem[] = []
  constructor(private fb: FormBuilder,private auditService:AuditItemService,public config: DynamicDialogConfig) {
    this.initForm()
  }
  initForm(){
    this.frequancyForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      riskRatingIds:[[], Validators.required]
    });
    
  }
  ngOnInit(): void {
    this.getRiskRating()
    
  }
  onRiskRatingChange(selectedId: number | null) {
    
    this.frequancyForm.patchValue({
      riskRatingIds: selectedId ? [selectedId] : []
    });
  }
  onSave() {
    if (this.frequancyForm.valid) {
      
      this.dialogRef.close({...this.frequancyForm.value,riskRatingIds:[this.frequancyForm.get('riskRatingIds')?.value]})
    } else {
      this.frequancyForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close()    
  }
  getRiskRating(){
    this.auditService.getRiskRating().subscribe({
      next:(res)=>{
        this.riskRatingList  = res
          if (this.config.data) {
          this.frequancyForm.patchValue({
            "name":this.config.data.name,
            "description":this.config.data.describtion,
            "riskRatingIds":this.config.data.riskratingId
          })          
        }
      }
    })
  }
 
}
