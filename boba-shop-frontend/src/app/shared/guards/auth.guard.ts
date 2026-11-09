import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/service/service-auth';

/**
 * ============================================================================
 * GUARDIA DE AUTENTICACIÓN (auth.guard.ts) - Basado en Inventario_Travelnet
 * ============================================================================
 * Protege el acceso a rutas que requieren sesión activa de empleado o administrador.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/** Guardia para vistas exclusivas de Administrador */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado() && authService.isAdmin()) {
    return true;
  }

  router.navigate(['/menu']);
  return false;
};
