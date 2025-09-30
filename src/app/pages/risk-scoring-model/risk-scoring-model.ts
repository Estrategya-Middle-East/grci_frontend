import { Component } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { Impact } from "./components/impact/impact";
import { Likelihood } from "./components/likelihood/likelihood";
import { Rating } from "./components/rating/rating";
import { DialogService } from "primeng/dynamicdialog";

@Component({
  selector: "app-risk-scoring-model",
  providers: [DialogService],
  imports: [TabsModule, Impact, Likelihood, Rating],
  templateUrl: "./risk-scoring-model.html",
  styleUrl: "./risk-scoring-model.scss",
})
export class RiskScoringModel {
  activeTab = 0;
}
