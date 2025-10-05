import { Component } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { Type } from "./components/type/type";
import { Automation } from "./components/automation/automation";
import { Category } from "./components/category/category";
import { Nature } from "./components/nature/nature";
import { DialogService } from "primeng/dynamicdialog";

@Component({
  selector: "app-mitigation",
  imports: [TabsModule, Type, Automation, Category, Nature],
  providers: [DialogService],
  templateUrl: "./mitigation.html",
  styleUrl: "./mitigation.scss",
})
export class Mitigation {
  activeTab = 0;
}
