export interface Payout {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  dealId?: string;
  incentivePlanId?: string;
  description: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

export interface PayoutFilters {
  userId?: string;
  status?: PayoutStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreatePayoutRequest {
  userId: string;
  amount: number;
  currency: string;
  dealId?: string;
  incentivePlanId?: string;
  description: string;
}

export interface UpdatePayoutRequest {
  amount?: number;
  currency?: string;
  status?: PayoutStatus;
  description?: string;
  paymentDate?: string;
}

export interface PayoutListResponse {
  payouts: Payout[];
  total: number;
  page: number;
  limit: number;
}
