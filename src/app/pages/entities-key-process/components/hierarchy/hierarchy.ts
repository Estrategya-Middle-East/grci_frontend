import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { EntitiesKeyProcessService } from "../../services/entities-key-process-service";
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from "ngx-echarts";
import type { EChartsOption } from "echarts";

@Component({
  selector: "app-hierarchy",
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import("echarts"),
      },
    },
  ],
  templateUrl: "./hierarchy.html",
  styleUrls: ["./hierarchy.scss"],
})
export class Hierarchy implements OnInit {
  private service = inject(EntitiesKeyProcessService);
  private route = inject(ActivatedRoute);

  keyProcesses: any[] = [];
  entityId$ = this.route.paramMap.pipe(map((params) => params.get("entityId")));
  entityId = toSignal(this.entityId$, { initialValue: null });

  options!: EChartsOption;
  orientation: "LR" | "TB" = "TB";

  containerHeight = 800; // default

  ngOnInit() {
    this.loadHierarchy();
  }

  loadHierarchy() {
    const id = this.entityId();
    if (!id) return;
    this.service.getHierarchy(id).subscribe({
      next: (res) => {
        this.keyProcesses = res || [];
        this.updateContainerHeight();
        this.buildChart();
      },
      error: (err) => console.error("Hierarchy load error", err),
    });
  }

  updateContainerHeight() {
    const perTreeHeight = 600; // px per tree
    const maxHeight = 2000; // max px container
    this.containerHeight = Math.min(
      this.keyProcesses.length * perTreeHeight,
      maxHeight
    );
  }

  buildChart() {
    if (!this.keyProcesses?.length) return;

    const totalRoots = this.keyProcesses.length;
    const perTreePercent = Math.floor(100 / totalRoots);

    const seriesData = this.keyProcesses.map((root, index) => {
      const topPercent = index * perTreePercent;

      const bottomPercent = 100 - topPercent - perTreePercent;

      return {
        type: "tree",
        data: [this.mapData(root)],
        top: `${index === 0 ? "5%" : topPercent}%`,
        left: "5%",
        bottom: `${bottomPercent + 5}%`,
        right: "5%",
        symbol: "circle",
        symbolSize: 1,
        orient: this.orientation,
        lineStyle: {
          color: "#90caf9",
          width: 1,
          curveness: 0.3,
        },
        label: {
          position: this.orientation === "LR" ? "left" : "top",
          verticalAlign: "middle",
          align: this.orientation === "LR" ? "right" : "center",
          fontSize: 12,
          fontWeight: 500,
          color: "#fff",
          borderRadius: 6,
          padding: [4, 8],
          lineHeight: 14,
        },
        leaves: {
          label: {
            position: this.orientation === "LR" ? "right" : "bottom",
            align: this.orientation === "LR" ? "left" : "center",
          },
        },
        layout: "orthogonal",
        expandAndCollapse: true,
        initialTreeDepth: -1,
        animationDuration: 600,
        animationDurationUpdate: 800,
        roam: false,
        symbolKeepAspect: true,
      };
    });

    this.options = {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
        backgroundColor: "#222",
        borderColor: "#444",
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (info: any) => `
          <div>
            <b>${info.data.name}</b><br/>
            <span style="color:#90caf9;">${this.getTypeName(
              info.data.type
            )}</span><br/>
            Owner: ${info.data.processOwnerName || "-"}
          </div>
        `,
      },
      series: seriesData as any,
    };
  }

  mapData(node: any): any {
    const typeInfo = this.getTypeVisual(node.type);
    return {
      name: node.name,
      type: node.type,
      processOwnerName: node.processOwnerName,
      label: {
        backgroundColor: typeInfo.color,
        borderColor: typeInfo.border,
        borderWidth: 2,
        shadowColor: "rgba(0,0,0,0.3)",
        shadowBlur: 5,
        fontWeight: "bold",
      },
      symbol: typeInfo.symbol,
      symbolSize: typeInfo.size,
      itemStyle: { color: typeInfo.color },
      children: node.children?.map((c: any) => this.mapData(c)) || [],
    };
  }

  getTypeVisual(type: number) {
    switch (type) {
      case 0:
        return {
          color: "#1565C0",
          border: "#64B5F6",
          symbol: "rect",
          size: 18,
        };
      case 1:
        return {
          color: "#2E7D32",
          border: "#81C784",
          symbol: "roundRect",
          size: 16,
        };
      case 2:
        return {
          color: "#F9A825",
          border: "#FFF176",
          symbol: "diamond",
          size: 14,
        };
      case 3:
        return {
          color: "#EF6C00",
          border: "#FFB74D",
          symbol: "circle",
          size: 12,
        };
      default:
        return {
          color: "#616161",
          border: "#9E9E9E",
          symbol: "circle",
          size: 10,
        };
    }
  }

  getTypeName(type: number): string {
    switch (type) {
      case 0:
        return "Process Group";
      case 1:
        return "Process";
      case 2:
        return "Activity";
      case 3:
        return "Task";
      default:
        return "Unknown";
    }
  }
}
