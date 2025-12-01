import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TopicsComponent } from './pages/topics/topics.component';
import { ResourceTypeComponent } from './pages/resource-type/resource-type.component';
import { BannerComponent } from './pages/banner/banner.component';
import { ResourceListComponent } from './pages/resources/resource-list.component';
import { ResourceDetailsComponent } from './pages/resources/resource-details.component';
import { ResourceEditComponent } from './pages/resources/resource-edit.component';
import { UserListComponent } from './pages/users/user-list.component';
import { UserDetailsComponent } from './pages/users/user-details.component';
import { UserEditComponent } from './pages/users/user-edit.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'topics',
    component: TopicsComponent,
  },
  {
    path: 'resource-type',
    component: ResourceTypeComponent,
  },
  {
    path: 'banner',
    component: BannerComponent,
  },
  {
    path: 'resources',
    component: ResourceListComponent,
  },
  {
    path: 'resources/new',
    component: ResourceEditComponent,
  },
  {
    path: 'resources/:id',
    component: ResourceDetailsComponent,
  },
  {
    path: 'resources/:id/edit',
    component: ResourceEditComponent,
  },
  {
    path: 'users',
    component: UserListComponent,
  },
  {
    path: 'users/new',
    component: UserEditComponent,
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent,
  },
  {
    path: 'users/:id/edit',
    component: UserEditComponent,
  },
  {
    path: 'auth/reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
