import { Component } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { TabsModule } from "primeng/tabs";
import { WeekEnd } from "./components/week-end/week-end";
import { PublicHoliday } from "./components/public-holiday/public-holiday";
import { LeaveDays } from "./components/leave-days/leave-days";

@Component({
  selector: "app-resources-unutilized-time",
  providers: [DialogService],
  imports: [TabsModule, WeekEnd, PublicHoliday, LeaveDays],
  templateUrl: "./resources-unutilized-time.html",
  styleUrl: "./resources-unutilized-time.scss",
})
export class ResourcesUnutilizedTime {
  activeTab = 0;
}
