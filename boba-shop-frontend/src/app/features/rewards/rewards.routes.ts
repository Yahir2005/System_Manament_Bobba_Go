import { Routes } from '@angular/router';

export const REWARDS_ROUTES: Routes = [
  {
    path: 'claim',
    loadComponent: () =>
      import('./pages/reward-claim/reward-claim').then(
        (m) => m.RewardClaim
      )
  },
  {
    path: '',
    redirectTo: 'claim',
    pathMatch: 'full'
  }
];