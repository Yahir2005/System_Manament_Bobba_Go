import { Routes } from '@angular/router';
import { authGuard, adminGuard } from '../../shared/guards/auth.guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list').then(
        (m) => m.ProductList
      )
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product-form/product-form').then(
        (m) => m.ProductForm
      )
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/product-form/product-form').then(
        (m) => m.ProductForm
      )
  },
  {
    path: 'approvals',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/product-approval-list/product-approval-list').then(
        (m) => m.ProductApprovalList
      )
  }
];
