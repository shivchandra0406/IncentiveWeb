export interface Deal {
  id: string;
  name: string;
  clientName: string;
  amount: number;
  currency: string;
  status: DealStatus;
  assignedTo: string;
  closedDate?: string;
  incentivePlanId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum DealStatus {
  NEW = 'NEW',
  PENDING = 'PENDING',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST'
}

export interface DealFilters {
  status?: DealStatus;
  assignedTo?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface CreateDealRequest {
  name: string;
  clientName: string;
  amount: number;
  currency: string;
  assignedTo: string;
  incentivePlanId?: string;
}

export interface UpdateDealRequest {
  name?: string;
  clientName?: string;
  amount?: number;
  currency?: string;
  status?: DealStatus;
  assignedTo?: string;
  closedDate?: string;
  incentivePlanId?: string;
}

export interface DealListResponse {
  deals: Deal[];
  total: number;
  page: number;
  limit: number;
}
