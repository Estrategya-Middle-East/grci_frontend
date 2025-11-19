import { Component, effect, inject, OnInit } from "@angular/core";
import { EVManagmentService } from "../../services/EVManagementLevel/evmanagment-service";
import { DialogService } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { MessageRequest } from "../../../audit/components/dialogs/message-request/message-request";
import { HttpErrorResponse } from "@angular/common/http";
import { EVLevelTable } from "../../components/evlevel-table/evlevel-table";
import { EVLevelToolbar } from "../../components/evlevel-toolbar/evlevel-toolbar";
import { AuditTeamFilter } from "../../../audit/components/audit-team-filter/audit-team-filter";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { EVLevelFilter } from "../../components/evlevel-filter/evlevel-filter";
import { EditEvidenceDialog } from "../../components/dialogs/edit-evidence-dialog/edit-evidence-dialog";

@Component({
  selector: "app-evidance-management-level",
  imports: [EVLevelTable, EVLevelToolbar, EVLevelFilter, NgbDropdownModule],
  providers: [DialogService, NgbDropdownModule],
  templateUrl: "./evidance-management-level.html",
  styleUrl: "./evidance-management-level.scss",
})
export class EvidanceManagementLevel implements OnInit {
  initialized: boolean = false;
  constructor(
    private evService: EVManagmentService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    effect(() => {
      const pagination = this.evService.pagination();

      // ✅ Skip first run to prevent unwanted auto-load
      if (!this.initialized) {
        this.initialized = true;
        this.evService.getTableData(pagination).subscribe();
        return;
      }

      // ✅ Reactively load when pagination changes (page, size)
      this.evService.getTableData(pagination).subscribe();
    });
  }
  ngOnInit(): void {
    this.evService.getTableData({}).subscribe((res) => {
      console.log(res);
    });
  }
  editEvLevels(row: any) {
    const ref = this.dialogService.open(EditEvidenceDialog, {
      header: "Edit Evidence Management",
      width: "600px",
      modal: true,
      data: {
        name: row.name,
        describtion: row.description,
      },
    });

    ref?.onClose.subscribe((result) => {
      if (result) {
        this.evService
          .editEvManagment({ ...result, id: row.id }, row.id)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message,
              });
              this.evService
                .getTableData(this.evService.pagination())
                .subscribe();
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
  deleteEvLevels(id: string, title: string) {
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
        this.evService.deleteEvManamgement(id).subscribe({
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
    this.evService.getTableData({}).subscribe();
  }
}
