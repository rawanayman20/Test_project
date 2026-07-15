import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/components/project-list/project-list.component').then(m => m.ProjectListComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/components/user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: '**',
    redirectTo: 'projects'
  }
];

