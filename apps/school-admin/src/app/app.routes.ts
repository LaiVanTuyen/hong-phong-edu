import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TopicsComponent } from './pages/topics/topics.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'topics',
    component: TopicsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
