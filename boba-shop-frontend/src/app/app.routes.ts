import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./features/menu/menu.routes').then((m) => m.MENU_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: 'loyalty',
    loadChildren: () =>
      import('./features/loyalty/loyalty.routes').then((m) => m.LOYALTY_ROUTES)
  },
  {
    path: 'rewards',
    loadChildren: () =>
      import('./features/rewards/rewards.routes').then((m) => m.REWARDS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'menu'
  }
];
