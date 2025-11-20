import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  activeRoute: string = '/';

  menuItems = [
    { icon: 'home', label: 'Dashboard', route: '/' },
    { icon: 'users', label: 'Students', route: '/students' },
    { icon: 'teacher', label: 'Teachers', route: '/teachers' },
    { icon: 'book', label: 'Courses', route: '/courses' },
    { icon: 'calendar', label: 'Schedule', route: '/schedule' },
    { icon: 'settings', label: 'Settings', route: '/settings' }
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.urlAfterRedirects;
    });
    this.activeRoute = this.router.url;
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
