import { Component, inject } from '@angular/core';
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

  qrInput = '';
  isProcessing = false;
  scanResult: ScanQrResponse | null = null;
  errorMessage = '';

  onScanSubmit(): void {
    if (!this.qrInput.trim()) return;

    this.isProcessing = true;
    this.errorMessage = '';
    this.scanResult = null;

    this.loyaltyService.scanQr({ qr_code: this.qrInput.trim() }).subscribe({
      next: (res) => {
        this.scanResult = res;
        this.isProcessing = false;
        this.qrInput = '';
      },
      error: (err) => {
        // Maneja el error cuando no han pasado 12 horas
        this.errorMessage = err.error?.message || 'Error al validar el código QR.';
        this.isProcessing = false;
      }
    });
  }
}