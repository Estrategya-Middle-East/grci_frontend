import { Component } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { ControlCategory } from "./components/control-category/control-category";
import { ControlSignificance } from "./components/control-significance/control-significance";
import { ControlAutomation } from "./components/control-automation/control-automation";
import { ControlNature } from "./components/control-nature/control-nature";
import { DialogService } from "primeng/dynamicdialog";

@Component({
  selector: "app-control",
  standalone: true,
  providers: [DialogService],
  imports: [
    TabsModule,
    ControlCategory,
    ControlSignificance,
    ControlAutomation,
    ControlNature,
  ],
  templateUrl: "./control.html",
  styleUrl: "./control.scss",
})
export class Control {
  activeTab = 0;
}
