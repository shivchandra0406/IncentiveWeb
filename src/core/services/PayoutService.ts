import { 
  CreatePayoutRequest, 
  Payout, 
  PayoutFilters, 
  PayoutListResponse, 
  UpdatePayoutRequest 
} from '../models/payout';

export interface PayoutService {
  getPayouts(filters?: PayoutFilters, page?: number, limit?: number): Promise<PayoutListResponse>;
  getPayoutById(id: string): Promise<Payout>;
  createPayout(payoutData: CreatePayoutRequest): Promise<Payout>;
  updatePayout(id: string, payoutData: UpdatePayoutRequest): Promise<Payout>;
  deletePayout(id: string): Promise<void>;
  approvePayout(id: string): Promise<Payout>;
  rejectPayout(id: string, reason: string): Promise<Payout>;
  markPayoutAsPaid(id: string, paymentDate: string): Promise<Payout>;
}
