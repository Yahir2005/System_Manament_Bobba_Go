import { Routes } from '@angular/router';

export const MENU_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/menu-catalog/menu-catalog').then(
        (m) => m.MenuCatalog
      )
  }
];