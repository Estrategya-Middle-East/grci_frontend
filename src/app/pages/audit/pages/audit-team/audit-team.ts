import { Component, effect, OnInit } from "@angular/core";
import { AuditTeamToolbar } from "../../components/audit-team-toolbar/audit-team-toolbar";
import { AuditTeamFilter } from "../../components/audit-team-filter/audit-team-filter";
import { AuditTable } from "../../components/audit-table/audit-table";
import { AuditTeamService } from "../../services/auditTeam/audit-team-service";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { MessageRequest } from "../../components/dialogs/message-request/message-request";
import { HttpErrorResponse } from "@angular/common/http";
import { AuditItemService } from "../../services/auditItem/audit-item-service";

@Component({
  selector: "app-audit-team",
  imports: [AuditTeamToolbar, AuditTeamFilter, AuditTable, NgbDropdownModule],
  providers: [DialogService],
  templateUrl: "./audit-team.html",
  styleUrl: "./audit-team.scss",
})
export class AuditTeam implements OnInit {
  roleOptions = [
    { label: "Manager", value: "1" },
    { label: "Senior", value: "2" },
    { label: "Auditor", value: "3" },
  ];
  initialized: boolean = false;
  constructor(
    private auditTeamsService: AuditTeamService,
    private auditService: AuditItemService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    effect(() => {
      const pagination = this.auditService.pagination();

      // ✅ Skip first run to prevent unwanted auto-load
      if (!this.initialized) {
        this.initialized = true;
        this.auditTeamsService.getTableData(pagination).subscribe();
        return;
      }

      // ✅ Reactively load when pagination changes (page, size)
      this.auditTeamsService.getTableData(pagination).subscribe();
    });
  }
  ngOnInit(): void {
    this.getTableData();
  }
  editAuditItemteam(row: any) {
    const matchedRole = this.roleOptions.find((r) => r.label === row.auditRole);
    this.auditTeamsService.editFeedback = {
      show: true,
      value: { ...row, auditRole: matchedRole?.value },
    };
  }

  deleteAuditItemteam(id: string, title: string) {
    const ref = this.dialogService.open(MessageRequest, {
      header: " ", // Empty space to show the close button, or remove for no header
      width: "600px",
      height: "370px",
      modal: true, // This adds the backdrop
      dismissableMask: false, // Prevents closing when clicking outside
      closable: false, // Remove the X button if you want
      data: {
        itemName: title, // Pass the item name to display
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.auditTeamsService.deleteAuditTeam(id).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            ref.close();
            this.getTableData();
          },
          error: (err: HttpErrorResponse) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: err.error.error[0],
            });
          },
        });
      }
    });
  }
  getTableData() {
    this.auditTeamsService.getTableData({}).subscribe();
  }
}
