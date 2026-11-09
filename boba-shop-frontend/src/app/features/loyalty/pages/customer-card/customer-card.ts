import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyService } from '../../service/service-loyalty';
import { Customer } from '../../models/loyalty.model';

@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-card.html',
  styleUrls: ['./customer-card.scss']
})
export class CustomerCard implements OnInit {
  private loyaltyService = inject(LoyaltyService);

  customer: Customer | null = null;
  slots = Array.from({ length: 10 }, (_, i) => i + 1);

  ngOnInit(): void {
    // Ejemplo: id del cliente autenticado o leído por parámetro
    this.loyaltyService.getCustomerCard(1).subscribe({
      next: (data) => (this.customer = data),
      error: (err) => console.error(err)
    });
  }
}