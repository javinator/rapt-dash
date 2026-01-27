import { Routes } from '@angular/router';
import { DashboardPage, HomePage } from '@pages';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'dash',
    component: DashboardPage,
  },
];
