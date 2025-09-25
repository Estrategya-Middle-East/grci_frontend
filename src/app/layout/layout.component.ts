import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { LoadingPageComponent } from '../shared/components/loading-page/loading-page.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, NgClass],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  sidebarExpanded = true;
  isReady = false;
  private resizeSubscription!: Subscription;
  isWidnow: any = null;
  isDocument: any = null;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // eslint-disable-next-line no-restricted-globals
      this.isWidnow = window;
      // eslint-disable-next-line no-restricted-globals
      this.isDocument = document;
      // eslint-disable-next-line no-restricted-globals
      this.sidebarExpanded = window.innerWidth >= 768;
    } else {
      this.isWidnow = null;
      this.isDocument = null;
    }
  }
  ngOnInit(): void {
    if (this.isWidnow) {
      this.checkWindowSize();
      this.resizeSubscription = fromEvent(this.isWidnow, 'resize')
        .pipe(debounceTime(200))
        .subscribe(() => this.checkWindowSize());
    }
  }
  checkWindowSize(): void {
    if (this.isWidnow) {
      this.sidebarExpanded = this.isWidnow?.innerWidth >= 768;
    }
    this.isReady = true;
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  handleClickOutsideSidebar(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isWidnow && this.isDocument) {
      const isClickInsideSidebar = this.isDocument
        .querySelector('.sidebar')
        ?.contains(target);
      const isClickInsideHeader = this.isDocument
        .querySelector('.header')
        ?.contains(target);
      if (
        this.isWidnow.innerWidth < 768 &&
        this.sidebarExpanded &&
        !isClickInsideSidebar &&
        !isClickInsideHeader
      ) {
        this.sidebarExpanded = false;
      }
    }
  }
}
