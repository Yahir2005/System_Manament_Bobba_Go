import { Routes } from '@angular/router';
import { authGuard, adminGuard } from '../../shared/guards/auth.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full'
  },
  {
    path: 'new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/categories-form/categories-form').then(
        (m) => m.CategoriesForm
      )
  }
];
