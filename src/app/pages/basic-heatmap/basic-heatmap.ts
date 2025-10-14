import { Component } from "@angular/core";
import { Heatmap } from "../../shared/components/heatmap/heatmap";

@Component({
  selector: "app-basic-heatmap",
  imports: [Heatmap],
  templateUrl: "./basic-heatmap.html",
  styleUrl: "./basic-heatmap.scss",
})
export class BasicHeatmap {}
