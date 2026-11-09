import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoyaltyService } from '../../service/service-loyalty';
import { ScanQrResponse } from '../../models/loyalty.model';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.scss']
})
export class QrScanner {
  private loyaltyService = inject(LoyaltyService);

  // Signals: necesarios en modo zoneless para reflejar la respuesta HTTP en la vista
  qrInput = signal('');
  isProcessing = signal(false);
  scanResult = signal<ScanQrResponse | null>(null);
  errorMessage = signal('');

  onScanSubmit(): void {
    const code = this.qrInput().trim();
    if (!code) return;

    this.isProcessing.set(true);
    this.errorMessage.set('');
    this.scanResult.set(null);

    this.loyaltyService.scanQr({ qr_code: code }).subscribe({
      next: (res) => {
        this.isProcessing.set(false);
        this.qrInput.set('');
        // El backend responde 200 con success=false cuando no han pasado 12 horas
        if (res.success) {
          this.scanResult.set(res);
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: (err) => {
        // Maneja el error cuando no han pasado 12 horas
        this.errorMessage.set(err.error?.message || 'Error al validar el código QR.');
        this.isProcessing.set(false);
      }
    });
  }
}