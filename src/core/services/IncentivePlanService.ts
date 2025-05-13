import { 
  CreateIncentivePlanRequest, 
  IncentivePlan, 
  IncentivePlanFilters, 
  IncentivePlanListResponse, 
  UpdateIncentivePlanRequest 
} from '../models/incentivePlan';

export interface IncentivePlanService {
  getIncentivePlans(filters?: IncentivePlanFilters, page?: number, limit?: number): Promise<IncentivePlanListResponse>;
  getIncentivePlanById(id: string): Promise<IncentivePlan>;
  createIncentivePlan(planData: CreateIncentivePlanRequest): Promise<IncentivePlan>;
  updateIncentivePlan(id: string, planData: UpdateIncentivePlanRequest): Promise<IncentivePlan>;
  deleteIncentivePlan(id: string): Promise<void>;
  activateIncentivePlan(id: string): Promise<IncentivePlan>;
  deactivateIncentivePlan(id: string): Promise<IncentivePlan>;
}
