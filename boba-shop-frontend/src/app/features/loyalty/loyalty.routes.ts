import { Routes } from '@angular/router';

export const LOYALTY_ROUTES: Routes = [
  {
    path: 'my-card',
    loadComponent: () =>
      import('./pages/customer-card/customer-card').then(
        (m) => m.CustomerCard
      )
  },
  {
    path: 'scan',
    loadComponent: () => 
        import('./pages/qr-scanner/qr-scanner').then(
            (m) => m.QrScanner
        )
  },
  {
    path: '',
    redirectTo: 'my-card',
    pathMatch: 'full'
  }
];