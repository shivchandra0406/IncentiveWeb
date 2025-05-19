import enhancedApiClient from '../apiClientWrapper';
import type { IncentiveRuleService } from '../../core/services/IncentiveRuleService';
import type { IncentivePlanBase } from '../../core/models/incentivePlanTypes';

class IncentiveRuleServiceImpl implements IncentiveRuleService {
  async getIncentiveRules(): Promise<{ succeeded: boolean, message: string, data: IncentivePlanBase[] }> {
    try {
      console.log('Fetching incentive rules');
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: IncentivePlanBase[] }>('/incentive-plans/active');
      console.log('Incentive rules response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching incentive rules:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch incentive rules');
    }
  }

  async getIncentiveRuleById(id: string): Promise<{ succeeded: boolean, message: string, data: IncentivePlanBase }> {
    try {
      console.log(`Fetching incentive rule with ID: ${id}`);
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: IncentivePlanBase }>(`/incentive-plans/${id}`);
      console.log('Incentive rule response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching incentive rule with ID ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || `Failed to fetch incentive rule with ID ${id}`);
    }
  }

  async getIncentiveRulesMinimal(): Promise<{ succeeded: boolean, message: string, data: IncentivePlanBase[] }> {
    try {
      console.log('Fetching minimal incentive plans');
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: IncentivePlanBase[] }>('/incentive-plans/minimal');
      console.log('Minimal incentive plans response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching minimal incentive plans:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch minimal incentive plans');
    }
  }
}

export default new IncentiveRuleServiceImpl();
