import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClaimRewardDto, RedeemedReward, RewardOption } from '../models/rewards.model';

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/rewards';

  getEligibleRewardProducts(): Observable<RewardOption[]> {
    return this.http.get<RewardOption[]>(`${this.apiUrl}/eligible-products`);
  }

  claimReward(payload: ClaimRewardDto): Observable<RedeemedReward> {
    return this.http.post<RedeemedReward>(`${this.apiUrl}/claim`, payload);
  }
}
export { RewardService as ServiceRewards };

