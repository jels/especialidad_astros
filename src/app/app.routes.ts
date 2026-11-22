import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Cosmos 101 · El cielo no es el límite',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'misiones',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'misiones/:slug',
    loadComponent: () =>
      import('./pages/mission-page/mission-page').then((m) => m.MissionPage),
  },
  {
    path: 'test-final',
    redirectTo: 'misiones/test-final',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
