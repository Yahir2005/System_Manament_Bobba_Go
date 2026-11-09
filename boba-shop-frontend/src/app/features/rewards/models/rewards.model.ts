import { Product } from '../../products/models/product.model';
import { Customer } from '../../loyalty/models/loyalty.model';

export interface RedeemedReward {
  id_redemption: number;
  id_customer: number;
  id_product: number;
  authorized_by: number;
  redeemed_at: string;
  customer?: Customer;
  product?: Product;
}

export interface ClaimRewardDto {
  id_customer: number;
  id_product: number;
}

export interface RewardOption {
  id_product: number;
  name: string;
  category_name: string;
  image_url: string | null;
}