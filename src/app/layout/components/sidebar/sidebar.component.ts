import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, AccordionModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
 @Input() isExpanded = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

     constructor(
      @Inject(PLATFORM_ID) private platformId: Object
    ) {
    if(isPlatformBrowser(this.platformId)) {
      // eslint-disable-next-line no-restricted-globals
      this.isExpanded = window?.innerWidth >= 768;
    }
  }
    handleSidebarToggle = () => {
    this.isExpanded =!this.isExpanded;
    this.toggleSidebar.emit(this.isExpanded);
  } 

}
