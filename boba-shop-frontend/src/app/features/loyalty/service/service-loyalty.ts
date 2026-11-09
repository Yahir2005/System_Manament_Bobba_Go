import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, ScanQrPayload, ScanQrResponse } from '../models/loyalty.model';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/loyalty';

  getCustomerCard(id_customer: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id_customer}`);
  }

  scanQr(payload: ScanQrPayload): Observable<ScanQrResponse> {
    return this.http.post<ScanQrResponse>(`${this.apiUrl}/scan`, payload);
  }
}

export {  LoyaltyService as ServiceLoyalty };

