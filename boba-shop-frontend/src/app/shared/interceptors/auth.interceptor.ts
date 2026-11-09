import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * ============================================================================
 * INTERCEPTOR HTTP DE AUTENTICACIÓN (auth.interceptor.ts)
 * ============================================================================
 * Basado en la implementación de Inventario_Travelnet:
 * 1. Lee el token JWT guardado en localStorage y lo añade a la cabecera Authorization.
 * 2. Si recibe 401 Unauthorized, redirige automáticamente a /auth/login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const clonedReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/api/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    })
  );
};
