import { Component, OnInit, inject } from '@angular/core';
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

  customerId: number | null = null;
  selectedProductId: number | null = null;
  rewardOptions: RewardOption[] = [];
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.rewardService.getEligibleRewardProducts().subscribe({
      next: (data) => (this.rewardOptions = data),
      error: (err) => console.error(err)
    });
  }

  onClaim(): void {
    if (!this.customerId || !this.selectedProductId) return;

    this.rewardService.claimReward({
      id_customer: this.customerId,
      id_product: this.selectedProductId
    }).subscribe({
      next: () => {
        this.successMessage = '¡Cortesía #11 entregada exitosamente! Se reinició el ciclo de sellos.';
        this.errorMessage = '';
        this.customerId = null;
        this.selectedProductId = null;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'El cliente no cuenta con los 10 sellos requeridos.';
        this.successMessage = '';
      }
    });
  }
}