import {
  Component,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  RouterModule,
  Router,
  NavigationEnd,
  NavigationStart,
} from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HorizontalSidebarComponent } from './layout/horizontal-sidebar/horizontal-sidebar.component';
import { TwoColSidebarComponent } from './layout/two-col-sidebar/two-col-sidebar.component';
import { filter } from 'rxjs/operators';

declare var feather: any;
declare var $: any;

import { CommonModule } from '@angular/common';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HorizontalSidebarComponent,
    TwoColSidebarComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnInit {
  protected title = 'school-admin';
  isAuthPage = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Show/hide global loader on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show loader when navigation starts
        $('#global-loader').fadeIn('fast');
      } else if (event instanceof NavigationEnd) {
        // Check if current page is an auth page
        this.checkAuthPage();

        // Hide loader and re-initialize feather icons when navigation ends
        setTimeout(() => {
          $('#global-loader').fadeOut('fast');
          if (typeof feather !== 'undefined') {
            feather.replace();
          }
        }, 300);
      }
    });
  }

  ngOnInit(): void {
    this.checkAuthPage();
  }

  ngAfterViewInit(): void {
    // Initial feather icons render and hide loader
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
    // Hide initial loader
    setTimeout(() => {
      $('#global-loader').fadeOut('slow');
    }, 500);
  }

  private checkAuthPage(): void {
    this.isAuthPage = this.router.url.includes('/auth/');
    console.log(
      'Current URL:',
      this.router.url,
      'isAuthPage:',
      this.isAuthPage
    );
    this.cdr.detectChanges();
  }
}
