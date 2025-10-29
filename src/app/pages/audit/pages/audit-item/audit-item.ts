import { Component, OnInit, signal } from '@angular/core';
import { AuditToolbar } from "../../components/audit-toolbar/audit-toolbar/audit-toolbar";
import { AuditFilter } from "../../components/audit-filter/audit-filter/audit-filter";
import { AuditTable } from "../../components/audit-table/audit-table";
import { List } from "../../../control-management/components/list/list";
import { AuditItemService } from '../../services/auditItem/audit-item-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-audit-item',
  imports: [AuditToolbar, AuditFilter, AuditTable,NgbDropdownModule,RouterModule],
  templateUrl: './audit-item.html',
  styleUrl: './audit-item.scss'
})
export class AuditItem implements OnInit{
  constructor(public auditService:AuditItemService){}
  ngOnInit(): void {
    
  }

}
