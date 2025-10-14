import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject, signal } from "@angular/core";
import { HeatmapService } from "./services/heatmap-service";
import { HeatmapCell, HeatmapInterface, HeatmapLevel } from "./models/heatmap";
@Component({
  selector: "app-heatmap",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./heatmap.html",
  styleUrls: ["./heatmap.scss"],
})
export class Heatmap implements OnInit {
  @Input({ required: true }) loadWithRisks: boolean = false;

  private heatmapService = inject(HeatmapService);

  impactColumns = signal<HeatmapLevel[]>([]);
  likelihoodRows = signal<HeatmapLevel[]>([]);
  cells = signal<HeatmapCell[]>([]);

  ngOnInit(): void {
    this.loadHeatmap();
  }

  private loadHeatmap(): void {
    if (this.loadWithRisks) {
      this.heatmapService.getHeatmapWithRisks().subscribe((data) => {
        this.setData(data);
      });
    } else {
      this.heatmapService.getHeatmap().subscribe((data) => {
        this.setData(data);
      });
    }
  }

  private setData(data: HeatmapInterface): void {
    data.impactColumns.sort((a, b) => a.position - b.position);
    data.likelihoodRows.sort((a, b) => b.position - a.position);
    this.impactColumns.set(data.impactColumns);
    this.likelihoodRows.set(data.likelihoodRows);
    this.cells.set(data.cells);
    document.documentElement.style.setProperty(
      "--impact-count",
      data.impactColumns.length.toString()
    );
  }

  getCellColor(impactId: number, likelihoodId: number): string {
    const cell = this.cells().find(
      (c) => c.impactId === impactId && c.likelihoodId === likelihoodId
    );
    return cell ? cell.color : "#ccc";
  }

  getCellLabel(impactId: number, likelihoodId: number): string {
    const cell = this.cells().find(
      (c) => c.impactId === impactId && c.likelihoodId === likelihoodId
    );
    return cell ? cell.score.toString() : "";
  }
}
