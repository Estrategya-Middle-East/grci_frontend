import { Component } from "@angular/core";
import { View } from "./components/view/view";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-audit-plan-memorandum",
  imports: [View],
  providers: [MessageService],
  templateUrl: "./audit-plan-memorandum.html",
  styleUrl: "./audit-plan-memorandum.scss",
})
export class AuditPlanMemorandum {}
