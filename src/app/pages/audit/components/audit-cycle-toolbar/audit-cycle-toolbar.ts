import { Component, inject } from "@angular/core";
import { AuditItemService } from "../../services/auditItem/audit-item-service";

@Component({
  selector: "app-audit-cycle-toolbar",
  imports: [],
  templateUrl: "./audit-cycle-toolbar.html",
  styleUrl: "./audit-cycle-toolbar.scss",
})
export class AuditCycleToolbar {
  auditService = inject(AuditItemService);
}
