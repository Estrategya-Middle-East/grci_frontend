import { Component, effect, inject, Input, ViewChild } from "@angular/core";
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { DeleteItemSelectedComponent } from "../../../../shared/components/delete-item-selected/delete-item-selected.component";
import { OrganizationsService } from "../../services/organizations.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppRoute } from "../../../../app.routes.enum";

@Component({
  selector: "app-board",
  standalone: true,
  imports: [NgbDropdownModule, DeleteItemSelectedComponent],
  providers: [NgbModalConfig, NgbModal],

  templateUrl: "./board.component.html",
  styleUrl: "./board.component.scss",
})
export class BoardComponent {
  @Input() dataOrganizations: any = {};
  organizationsService = inject(OrganizationsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @ViewChild("content", { static: false }) content: any;
  private dataOrig: any = null;
  viewData: any = {};

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = "static";
    config.keyboard = false;
    effect(() => {
      let closeDialog = this.organizationsService.getCloseDialog();
      if (closeDialog) {
        this.close();
      }
    });
  }

  open(content: any) {
    this.modalService.open(content, { size: "xl" });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
  openDelete(data: any) {
    this.viewData = {
      title: `Delete “${data.title}”`,
      sendLabel: "Delete",
      sendClose: "Cancel",
    };
    this.dataOrig = data;
    this.modalService.open(this.content);
  }
  openArchived(data: any) {
    this.viewData = {
      title: `Archived “${data.title}”`,
      sendLabel: "Confirm Archive",
      sendClose: "Cancel",
    };
    this.dataOrig = data;
    this.modalService.open(this.content);
  }
  send() {
    if (this.viewData?.title?.includes("Delete")) {
      this.organizationsService.triggerDelete(this.dataOrig);
    } else {
      this.organizationsService.triggerArchive(this.dataOrig);
    }
    this.close();
  }
  close() {
    this.modalService.dismissAll();
    this.dataOrig = null;
  }

  navigateToEdit(id: number) {
    this.router.navigate(["edit", id], { relativeTo: this.route });
  }

  navigateToView(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  navigateToStrategies(id: number) {
    this.router.navigate([id, `${AppRoute.STRATEGIES}`], {
      relativeTo: this.route,
    });
  }
}
