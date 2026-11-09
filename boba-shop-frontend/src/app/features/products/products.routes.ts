import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./pages/product-form/product-form').then(
        (m) => m.ProductForm
      )
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/product-form/product-form').then(
        (m) => m.ProductForm
      )
  },
  {
    path: 'approvals',
    loadComponent: () =>
      import('./pages/product-approval-list/product-approval-list').then(
        (m) => m.ProductApprovalList
      )
  }
];