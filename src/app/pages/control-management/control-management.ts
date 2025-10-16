import { Component } from "@angular/core";
import { View } from "./components/view/view";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-control-management",
  imports: [View],
  providers: [MessageService],
  templateUrl: "./control-management.html",
  styleUrl: "./control-management.scss",
})
export class ControlManagement {}
