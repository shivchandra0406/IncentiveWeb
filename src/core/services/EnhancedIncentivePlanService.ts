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
} from '../models/incentivePlanTypes';

export type EnhancedIncentivePlanService = {
  // Get all incentive plans with optional filtering
  getIncentivePlans(filters?: IncentivePlanFilters, page?: number, limit?: number): Promise<IncentivePlanListResponse>;
  
  // Get specific incentive plan by ID
  getIncentivePlanById(id: string): Promise<IncentivePlanResponse<IncentivePlanBase>>;
  getTargetBasedPlanById(id: string): Promise<IncentivePlanResponse<TargetBasedIncentivePlan>>;
  getRoleBasedPlanById(id: string): Promise<IncentivePlanResponse<RoleBasedIncentivePlan>>;
  getProjectBasedPlanById(id: string): Promise<IncentivePlanResponse<ProjectBasedIncentivePlan>>;
  getKickerPlanById(id: string): Promise<IncentivePlanResponse<KickerIncentivePlan>>;
  getTieredPlanById(id: string): Promise<IncentivePlanResponse<TieredIncentivePlan>>;
  
  // Create incentive plans
  createTargetBasedPlan(plan: CreateTargetBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  createRoleBasedPlan(plan: CreateRoleBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  createProjectBasedPlan(plan: CreateProjectBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  createKickerPlan(plan: CreateKickerIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  createTieredPlan(plan: CreateTieredIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  
  // Update incentive plans
  updateTargetBasedPlan(id: string, plan: UpdateTargetBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  updateRoleBasedPlan(id: string, plan: UpdateRoleBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  updateProjectBasedPlan(id: string, plan: UpdateProjectBasedIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  updateKickerPlan(id: string, plan: UpdateKickerIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  updateTieredPlan(id: string, plan: UpdateTieredIncentivePlanRequest): Promise<CreateIncentivePlanResponse>;
  
  // Delete incentive plan
  deleteIncentivePlan(id: string): Promise<CreateIncentivePlanResponse>;
  
  // Toggle incentive plan active status
  toggleIncentivePlanStatus(id: string, isActive: boolean): Promise<CreateIncentivePlanResponse>;
  
  // Get projects for project-based plans
  getProjects(): Promise<Project[]>;
  
  // Get teams for role-based plans
  getTeams(): Promise<Team[]>;
  
  // Get team details by ID
  getTeamById(teamId: string): Promise<Team>;
  
  // Get team members by team ID
  getTeamMembers(teamId: string): Promise<TeamMember[]>;
};
