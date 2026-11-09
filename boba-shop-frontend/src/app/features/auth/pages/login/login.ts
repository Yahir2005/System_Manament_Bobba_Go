import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/service-auth';

/**
 * ============================================================================
 * COMPONENTE: LOGIN (login.ts) - Basado en Inventario_Travelnet
 * ============================================================================
 * Pantalla de inicio de sesión para empleados y administradores de Bobba Go.
 * Permite alternar la visibilidad de la contraseña y redirige a la vista privada.
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  credenciales = {
    email: '',
    password: ''
  };

  // Signals: necesarios en modo zoneless para reflejar la respuesta HTTP en la vista
  mensajeError = signal('');
  isSubmitting = signal(false);
  mostrarPassword = signal(false);

  togglePassword(): void {
    this.mostrarPassword.update((v) => !v);
  }

  onLogin(): void {
    if (!this.credenciales.email || !this.credenciales.password) {
      this.mensajeError.set('Por favor ingresa tu correo y contraseña.');
      return;
    }

    this.isSubmitting.set(true);
    this.mensajeError.set('');

    this.authService.login(this.credenciales).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.mensajeError.set(err.error?.error || err.error?.message || 'Credenciales incorrectas. Intenta de nuevo.');
      }
    });
  }
}
