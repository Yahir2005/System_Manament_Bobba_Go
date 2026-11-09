import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginCredentials, User } from '../models/auth.model';

/**
 * ============================================================================
 * SERVICIO DE AUTENTICACIÓN (service-auth.ts) - Basado en Inventario_Travelnet
 * ============================================================================
 * Gestiona el login, almacenamiento seguro del token JWT en localStorage,
 * validación de expiración y estado de la sesión actual.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';

  // Señal reactiva para el usuario conectado actualmente
  readonly currentUser = signal<User | null>(this.getStoredUser());

  /** Envía credenciales al servidor y almacena token y datos del usuario */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res && res.token) {
          const user = this.normalizeUser(res.user);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    );
  }

  /**
   * Comprueba si existe un token JWT válido y no expirado en localStorage
   * (Misma lógica de validación de payload base64 de TravelNet)
   */
  estaAutenticado(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.cerrarSesionLocal();
        return false;
      }
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        this.cerrarSesionLocal();
        return false;
      }
      return true;
    } catch {
      this.cerrarSesionLocal();
      return false;
    }
  }

  /** Alias para compatibilidad */
  isAuthenticated(): boolean {
    return this.estaAutenticado();
  }

  /** Cierra la sesión activa y redirige al login */
  logout(): void {
    this.cerrarSesionLocal();
    this.router.navigate(['/auth/login']);
  }

  private cerrarSesionLocal(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  /** Obtiene los datos del usuario almacenados */
  getStoredUser(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return this.normalizeUser(parsed);
    } catch {
      return null;
    }
  }

  /** Retorna el usuario activo */
  getCurrentUser(): User | null {
    const u = this.currentUser() || this.getStoredUser();
    return u ? this.normalizeUser(u) : null;
  }

  /** Normaliza el campo role para que siempre tenga el formato { id_role, name } */
  private normalizeUser(user: any): User {
    if (!user) return user;
    if (typeof user.role === 'string') {
      return {
        ...user,
        role: {
          id_role: user.id_role,
          name: user.role
        }
      };
    }
    return user as User;
  }

  /** Determina si el usuario tiene rol de administrador */
  isAdmin(): boolean {
    const u = this.getCurrentUser();
    if (!u) return false;
    return u.role?.name === 'administrator' || u.id_role === 1;
  }

  /** Determina si el usuario es empleado */
  isEmployee(): boolean {
    const u = this.getCurrentUser();
    if (!u) return false;
    return u.role?.name === 'employee' || u.id_role === 2;
  }
}

export { AuthService as ServiceAuth };
