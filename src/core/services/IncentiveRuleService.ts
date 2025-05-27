import { IncentivePlanBase } from '../models/incentivePlanTypes';

export interface IncentiveRuleService {
  getIncentiveRules(): Promise<{ succeeded: boolean, message: string, data: IncentivePlanBase[] }>;
  getIncentiveRuleById(id: string): Promise<{ succeeded: boolean, message: string, data: IncentivePlanBase }>;
}
