import { Component, AfterViewInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { HorizontalSidebarComponent } from "./layout/horizontal-sidebar/horizontal-sidebar.component";
import { TwoColSidebarComponent } from "./layout/two-col-sidebar/two-col-sidebar.component";
import { filter } from 'rxjs/operators';

declare var feather: any;
declare var $: any;

@Component({
  imports: [RouterModule, HeaderComponent, FooterComponent, SidebarComponent, HorizontalSidebarComponent, TwoColSidebarComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected title = 'school-admin';

  constructor(private router: Router) {
    // Show/hide global loader on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show loader when navigation starts
        $('#global-loader').fadeIn('fast');
      } else if (event instanceof NavigationEnd) {
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
}
