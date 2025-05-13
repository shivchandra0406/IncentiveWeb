import { 
  CreateDealRequest, 
  Deal, 
  DealFilters, 
  DealListResponse, 
  UpdateDealRequest 
} from '../models/deal';

export interface DealService {
  getDeals(filters?: DealFilters, page?: number, limit?: number): Promise<DealListResponse>;
  getDealById(id: string): Promise<Deal>;
  createDeal(dealData: CreateDealRequest): Promise<Deal>;
  updateDeal(id: string, dealData: UpdateDealRequest): Promise<Deal>;
  deleteDeal(id: string): Promise<void>;
  closeDealAsWon(id: string, closedDate?: string): Promise<Deal>;
  closeDealAsLost(id: string, closedDate?: string): Promise<Deal>;
}
