import { Component, ContentChild, effect, OnInit, TemplateRef } from '@angular/core';
import { AuditItemService } from '../../services/auditItem/audit-item-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { CustomPaginatorComponent } from "../../../../shared/components/custom-paginator/custom-paginator.component";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuditItem } from '../../models/interfaces/audit-item';

@Component({
  selector: 'app-audit-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, CustomPaginatorComponent, NgbDropdownModule,],
  templateUrl: './audit-table.html',
  styleUrl: './audit-table.scss'
})
export class AuditTable implements OnInit {
  @ContentChild('actionTemplate') actionsTemplate!: TemplateRef<any>;
  constructor(public auditService: AuditItemService) {}

  ngOnInit(): void {
    
  }
loadControls(event:{ pageNumber: number; pageSize: number }){
  
  this.auditService.pagination.set(event)
}
  
}
