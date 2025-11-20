import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-horizontal-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './horizontal-sidebar.component.html',
  styleUrls: ['./horizontal-sidebar.component.scss']
})
export class HorizontalSidebarComponent {
  menuItems = [
    { icon: 'home', label: 'Dashboard', route: '/' },
    { icon: 'users', label: 'Students', route: '/students' },
    { icon: 'teacher', label: 'Teachers', route: '/teachers' },
    { icon: 'book', label: 'Courses', route: '/courses' },
    { icon: 'calendar', label: 'Schedule', route: '/schedule' },
    { icon: 'settings', label: 'Settings', route: '/settings' }
  ];
}
