import enhancedApiClient from '../apiClientWrapper';
import type { EnhancedIncentivePlanService } from '../../core/services/EnhancedIncentivePlanService';
import type {
  IncentivePlanBase,
  TargetBasedIncentivePlan,
  RoleBasedIncentivePlan,
  ProjectBasedIncentivePlan,
  KickerIncentivePlan,
  TieredIncentivePlan,
  IncentivePlanFilters,
  IncentivePlanListResponse,
  IncentivePlanResponse,
  CreateIncentivePlanResponse,
  CreateTargetBasedIncentivePlanRequest,
  CreateRoleBasedIncentivePlanRequest,
  CreateProjectBasedIncentivePlanRequest,
  CreateKickerIncentivePlanRequest,
  CreateTieredIncentivePlanRequest,
  UpdateTargetBasedIncentivePlanRequest,
  UpdateRoleBasedIncentivePlanRequest,
  UpdateProjectBasedIncentivePlanRequest,
  UpdateKickerIncentivePlanRequest,
  UpdateTieredIncentivePlanRequest,
  Project,
  Team,
  TeamMember
} from '../../core/models/incentivePlanTypes';

class IncentivePlanServiceImpl implements EnhancedIncentivePlanService {
  // Get all incentive plans with optional filtering
  async getIncentivePlans(filters?: IncentivePlanFilters, page: number = 1, limit: number = 10): Promise<IncentivePlanListResponse> {
    const response = await enhancedApiClient.get<IncentivePlanListResponse>('/incentive-plans', {
      params: {
        ...filters,
        page,
        limit
      }
    });
    return response.data;
  }

  // Get specific incentive plan by ID
  async getIncentivePlanById(id: string): Promise<IncentivePlanResponse<IncentivePlanBase>> {
    try {
      const response = await enhancedApiClient.get<IncentivePlanResponse<IncentivePlanBase>>(`/incentive-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incentive plan by ID:', error);
      // If the generic endpoint fails, we'll return a failed response
      return {
        succeeded: false,
        message: 'Failed to fetch incentive plan. Please try using a type-specific endpoint.',
        data: null as any // This is correct for IncentivePlanResponse which has a data property
      };
    }
  }

  async getTargetBasedPlanById(id: string): Promise<IncentivePlanResponse<TargetBasedIncentivePlan>> {
    try {
      // Use the common endpoint for fetching plan details
      console.log(`Calling API: GET /incentive-plans/${id}`);
      const response = await enhancedApiClient.get<IncentivePlanResponse<TargetBasedIncentivePlan>>(`/incentive-plans/${id}`);
      console.log('API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching target-based plan:', error);
      console.error('Error response:', error.response?.data);

      // Return a failed response
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch target-based plan',
        data: null as any
      };
    }
  }

  async getRoleBasedPlanById(id: string): Promise<IncentivePlanResponse<RoleBasedIncentivePlan>> {
    try {
      // Use the common endpoint for fetching plan details
      console.log(`Calling API: GET /incentive-plans/${id}`);
      const response = await enhancedApiClient.get<IncentivePlanResponse<RoleBasedIncentivePlan>>(`/incentive-plans/${id}`);
      console.log('API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching role-based plan:', error);
      console.error('Error response:', error.response?.data);

      // Return a failed response
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch role-based plan',
        data: null as any
      };
    }
  }

  async getProjectBasedPlanById(id: string): Promise<IncentivePlanResponse<ProjectBasedIncentivePlan>> {
    try {
      // Use the common endpoint for fetching plan details
      console.log(`Calling API: GET /incentive-plans/${id}`);
      const response = await enhancedApiClient.get<IncentivePlanResponse<ProjectBasedIncentivePlan>>(`/incentive-plans/${id}`);
      console.log('API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching project-based plan:', error);
      console.error('Error response:', error.response?.data);

      // Return a failed response
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch project-based plan',
        data: null as any // This is correct for IncentivePlanResponse which has a data property
      };
    }
  }

  async getKickerPlanById(id: string): Promise<IncentivePlanResponse<KickerIncentivePlan>> {
    try {
      // Use the common endpoint for fetching plan details
      console.log(`Calling API: GET /incentive-plans/${id}`);
      const response = await enhancedApiClient.get<IncentivePlanResponse<KickerIncentivePlan>>(`/incentive-plans/${id}`);
      console.log('API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching kicker plan:', error);
      console.error('Error response:', error.response?.data);

      // Return a failed response
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch kicker plan',
        data: null as any
      };
    }
  }

  async getTieredPlanById(id: string): Promise<IncentivePlanResponse<TieredIncentivePlan>> {
    try {
      // Use the common endpoint for fetching plan details
      console.log(`Calling API: GET /incentive-plans/${id}`);
      const response = await enhancedApiClient.get<IncentivePlanResponse<TieredIncentivePlan>>(`/incentive-plans/${id}`);
      console.log('API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tiered plan:', error);
      console.error('Error response:', error.response?.data);

      // Return a failed response
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to fetch tiered plan',
        data: null as any
      };
    }
  }

  // Create incentive plans
  async createTargetBasedPlan(plan: CreateTargetBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.post<CreateIncentivePlanResponse>('/incentive-plans/target-based', plan);
    return response.data;
  }

  async createRoleBasedPlan(plan: CreateRoleBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.post<CreateIncentivePlanResponse>('/incentive-plans/role-based', plan);
    return response.data;
  }

  async createProjectBasedPlan(plan: CreateProjectBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    try {
      console.log('Creating project-based plan with data:', plan);
      const response = await enhancedApiClient.post<CreateIncentivePlanResponse>('/incentive-plans/project-based', plan);
      console.log('Create project-based plan response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating project-based plan:', error);
      console.error('Error response:', error.response?.data);
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to create project-based plan',
        planId: ''
      };
    }
  }

  async createKickerPlan(plan: CreateKickerIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.post<CreateIncentivePlanResponse>('/incentive-plans/kicker', plan);
    return response.data;
  }

  async createTieredPlan(plan: CreateTieredIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.post<CreateIncentivePlanResponse>('/incentive-plans/tiered-based', plan);
    return response.data;
  }

  // Update incentive plans
  async updateTargetBasedPlan(id: string, plan: UpdateTargetBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    try {
      // Use the type-specific endpoint for target-based plans
      console.log(`Calling API: PUT /incentive-plans/target-based/${id}`);
      console.log('Request payload:', plan);

      const response = await enhancedApiClient.put<CreateIncentivePlanResponse>(`/incentive-plans/target-based/${id}`, plan);

      console.log('API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating target-based plan:', error);
      console.error('Error response:', error.response?.data);

      // Return a failed response
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to update target-based plan',
        planId: ''
      };
    }
  }

  async updateRoleBasedPlan(id: string, plan: UpdateRoleBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.put<CreateIncentivePlanResponse>(`/incentive-plans/role-based/${id}`, plan);
    return response.data;
  }

  async updateProjectBasedPlan(id: string, plan: UpdateProjectBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    try {
      console.log(`Updating project-based plan with ID ${id}:`, plan);
      const response = await enhancedApiClient.put<CreateIncentivePlanResponse>(`/incentive-plans/project-based/${id}`, plan);
      console.log('Update project-based plan response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating project-based plan:', error);
      console.error('Error response:', error.response?.data);
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to update project-based plan',
        planId: ''
      };
    }
  }

  async updateKickerPlan(id: string, plan: UpdateKickerIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.put<CreateIncentivePlanResponse>(`/incentive-plans/kicker/${id}`, plan);
    return response.data;
  }

  async updateTieredPlan(id: string, plan: UpdateTieredIncentivePlanRequest): Promise<CreateIncentivePlanResponse> {
    try {
      console.log(`Calling API: PUT /incentive-plans/tiered-based/${id}`);
      console.log('Request payload:', plan);

      const response = await enhancedApiClient.put<CreateIncentivePlanResponse>(`/incentive-plans/tiered-based/${id}`, plan);

      console.log('API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating tiered-based plan:', error);
      console.error('Error response:', error.response?.data);

      // Return a failed response
      return {
        succeeded: false,
        message: error.response?.data?.message || error.message || 'Failed to update tiered-based plan',
        planId: ''
      };
    }
  }

  // Delete incentive plan
  async deleteIncentivePlan(id: string): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.delete<CreateIncentivePlanResponse>(`/incentive-plans/${id}`);
    return response.data;
  }

  // Toggle incentive plan active status
  async toggleIncentivePlanStatus(id: string, isActive: boolean): Promise<CreateIncentivePlanResponse> {
    const response = await enhancedApiClient.patch<CreateIncentivePlanResponse>(`/incentive-plans/${id}/status`, { isActive });
    return response.data;
  }

  // Get projects for project-based plans
  async getProjects(): Promise<Project[]> {
    const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Project[] }>('/projects');
    return response.data.data;
  }

  // Get teams for role-based plans
  async getTeams(): Promise<Team[]> {
    const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Team[] }>('/api/teams');
    return response.data.data;
  }

  // Get team details by ID
  async getTeamById(teamId: string): Promise<Team> {
    const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Team }>(`/api/teams/${teamId}`);
    return response.data.data;
  }

  // Get team members by team ID
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: TeamMember[] }>(`/api/teams/${teamId}/members`);
    return response.data.data;
  }
}

export default new IncentivePlanServiceImpl();
