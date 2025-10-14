import { Component } from "@angular/core";
import { Heatmap } from "../../shared/components/heatmap/heatmap";

@Component({
  selector: "app-risk-heatmap",
  imports: [Heatmap],
  templateUrl: "./risk-heatmap.html",
  styleUrl: "./risk-heatmap.scss",
})
export class RiskHeatmap {}
