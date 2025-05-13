export interface IncentivePlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: IncentivePlanStatus;
  rules: IncentiveRule[];
  createdAt: string;
  updatedAt: string;
}

export enum IncentivePlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}

export interface IncentiveRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  reward: Reward;
}

export interface Reward {
  type: RewardType;
  amount: number;
  currency: string;
}

export enum RewardType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
  POINTS = 'POINTS'
}

export interface IncentivePlanFilters {
  status?: IncentivePlanStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateIncentivePlanRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rules: Omit<IncentiveRule, 'id'>[];
}

export interface UpdateIncentivePlanRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: IncentivePlanStatus;
  rules?: IncentiveRule[];
}

export interface IncentivePlanListResponse {
  plans: IncentivePlan[];
  total: number;
  page: number;
  limit: number;
}
