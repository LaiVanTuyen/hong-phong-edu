import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-two-col-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './two-col-sidebar.component.html',
  styleUrls: ['./two-col-sidebar.component.scss']
})
export class TwoColSidebarComponent {
  mainMenuItems = [
    { icon: '🏠', route: '/', tooltip: 'Dashboard' },
    { icon: '👥', route: '/students', tooltip: 'Students' },
    { icon: '👨‍🏫', route: '/teachers', tooltip: 'Teachers' },
    { icon: '📚', route: '/courses', tooltip: 'Courses' },
    { icon: '📅', route: '/schedule', tooltip: 'Schedule' },
    { icon: '⚙️', route: '/settings', tooltip: 'Settings' }
  ];

  secondaryMenuItems = [
    { label: 'Overview', route: '/' },
    { label: 'Analytics', route: '/analytics' },
    { label: 'Reports', route: '/reports' },
    { label: 'Activity', route: '/activity' }
  ];
}
