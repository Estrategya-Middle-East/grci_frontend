import { Component, Input, OnChanges, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { EntitiesKeyProcessService } from "../../services/entities-key-process-service";

@Component({
  selector: "app-hierarchy",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./hierarchy.html",
  styleUrl: "./hierarchy.scss",
})
export class Hierarchy implements OnChanges {
  @Input() filters: Record<string, any> = {};

  private service = inject(EntitiesKeyProcessService);
  private route = inject(ActivatedRoute);

  keyProcesses: any[] = [];

  entityId$ = this.route.paramMap.pipe(map((params) => params.get("entityId")));
  entityId = toSignal(this.entityId$, { initialValue: null });

  ngOnChanges() {
    this.loadHierarchy();
  }

  loadHierarchy() {
    const id = this.entityId();
    if (!id) return;
    this.service.getHierarchy(id).subscribe({
      next: (res) => {
        this.keyProcesses = res || [];
        console.log("Hierarchy:", this.keyProcesses);
      },
      error: (err) => console.error("Hierarchy load error", err),
    });
  }

  getIcon(type: number) {
    switch (type) {
      case 0:
        return "pi pi-sitemap text-blue-600";
      case 1:
        return "pi pi-share-alt text-green-600";
      case 2:
        return "pi pi-cog text-yellow-600";
      default:
        return "pi pi-circle";
    }
  }
}
