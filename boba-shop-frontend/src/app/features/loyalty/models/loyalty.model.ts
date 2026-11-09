export interface Customer {
  id_customer: number;
  name: string;
  phone: string;
  qr_code: string;
  stamps_count: number;
  created_at: string;
}

export interface LoyaltyVisit {
  id_visit: number;
  id_customer: number;
  registered_by: number;
  visited_at: string;
}

export interface ScanQrPayload {
  qr_code: string;
}

export interface ScanQrResponse {
  success: boolean;
  message: string;
  stamps_count: number;
  eligible_for_reward: boolean;
  hours_since_last_stamp?: number;
}