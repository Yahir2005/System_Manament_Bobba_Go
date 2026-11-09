import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RewardService } from '../../service/service-rewards';
import { RewardOption } from '../../models/rewards.model';

@Component({
  selector: 'app-reward-claim',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reward-claim.html',
  styleUrls: ['./reward-claim.scss']
})
export class RewardClaim implements OnInit {
  private rewardService = inject(RewardService);

  // Signals: necesarios en modo zoneless para reflejar la respuesta HTTP en la vista
  customerId = signal<number | null>(null);
  selectedProductId = signal<number | null>(null);
  rewardOptions = signal<RewardOption[]>([]);
  successMessage = signal('');
  errorMessage = signal('');

  ngOnInit(): void {
    this.rewardService.getEligibleRewardProducts().subscribe({
      next: (data) => this.rewardOptions.set(data),
      error: (err) => console.error(err)
    });
  }

  onClaim(): void {
    const id_customer = this.customerId();
    const id_product = this.selectedProductId();
    if (!id_customer || !id_product) return;

    this.rewardService.claimReward({
      id_customer,
      id_product
    }).subscribe({
      next: () => {
        this.successMessage.set('¡Cortesía #11 entregada exitosamente! Se reinició el ciclo de sellos.');
        this.errorMessage.set('');
        this.customerId.set(null);
        this.selectedProductId.set(null);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || err.error?.message || 'El cliente no cuenta con los 10 sellos requeridos.');
        this.successMessage.set('');
      }
    });
  }
}