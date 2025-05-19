import {
  CreateDealRequest,
  Deal,
  DealFilters,
  DealListResponse,
  DealResponse,
  UpdateDealRequest
} from '../models/deal';

export interface DealService {
  getDeals(filters?: DealFilters, page?: number, limit?: number): Promise<DealListResponse>;
  getDealById(id: string): Promise<DealResponse>;
  createDeal(dealData: CreateDealRequest): Promise<DealResponse>;
  updateDeal(id: string, dealData: UpdateDealRequest): Promise<DealResponse>;
  deleteDeal(id: string): Promise<{ succeeded: boolean, message: string }>;
}
