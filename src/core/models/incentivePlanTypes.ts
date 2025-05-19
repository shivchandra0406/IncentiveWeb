// Enums
export enum IncentivePlanType {
  TargetBased = 'TargetBased',
  RoleBased = 'RoleBased',
  ProjectBased = 'ProjectBased',
  KickerBased = 'KickerBased',
  TieredBased = 'TieredBased'
}

export enum PeriodType {
  None = 'None',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  HalfYearly = 'HalfYearly',
  Yearly = 'Yearly',
  Custom = 'Custom'
}

export enum MetricType {
  BookingValue = 'BookingValue',
  UnitsSold = 'UnitsSold',
  Revenue = 'Revenue'
}

export enum TargetType {
  SalaryBased = 'SalaryBased',
  MetricBased = 'MetricBased'
}

export enum IncentiveCalculationType {
  FixedAmount = 'FixedAmount',
  PercentageOnTarget = 'PercentageOnTarget'
}

export enum AwardType {
  Cash = 'Cash',
  Gift = 'Gift'
}

export enum CurrencyType {
  Rupees = 'Rupees',
  Dollar = 'Dollar'
}

// Base Plan Interface
export interface IncentivePlanBase {
  id: string;
  planName: string;
  planType: IncentivePlanType;
  periodType: PeriodType;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
}

// Target-Based Incentive Plan
export interface TargetBasedIncentivePlan extends IncentivePlanBase {
  targetType: TargetType;
  salary?: number;
  metricType: MetricType;
  targetValue: number;
  calculationType: IncentiveCalculationType;
  incentiveValue: number;
  currencyType: CurrencyType;
  isCumulative: boolean;
  incentiveAfterExceedingTarget: boolean;
  includeSalaryInTarget: boolean;
  provideAdditionalIncentiveOnExceeding?: boolean;
  additionalIncentivePercentage?: number;
}

// Role-Based Incentive Plan
export interface RoleBasedIncentivePlan extends IncentivePlanBase {
  role: string;
  isTeamBased: boolean;
  teamId?: string;
  targetType: TargetType;
  salaryPercentage?: number;
  metricType: MetricType;
  targetValue: number;
  calculationType: IncentiveCalculationType;
  incentiveValue: number;
  currencyType: CurrencyType;
  isCumulative: boolean;
  incentiveAfterExceedingTarget: boolean;
  includeSalaryInTarget: boolean;
  provideAdditionalIncentiveOnExceeding?: boolean;
  additionalIncentivePercentage?: number;
}

// Project-Based Incentive Plan
export interface ProjectBasedIncentivePlan extends IncentivePlanBase {
  projectId: string;
  metricType: MetricType;
  targetValue: number;
  incentiveValue: number;
  calculationType: IncentiveCalculationType;
  currencyType: CurrencyType;
  incentiveAfterExceedingTarget?: boolean; // Keeping for backward compatibility
  isCumulative: boolean;
}

// Kicker-Based Incentive Plan
export interface KickerIncentivePlan extends IncentivePlanBase {
  targetType: TargetType;
  salary?: number;
  metricType: MetricType;
  targetValue: number;
  calculationType: IncentiveCalculationType;
  incentiveValue: number;
  consistencyMonths: number;
  awardType: AwardType;
  awardValue?: number;
  currencyType: CurrencyType;
  giftDescription?: string;
}

// Tiered-Based Incentive Plan
export interface TieredIncentiveTier {
  id?: string;
  fromValue: number;
  toValue: number;
  incentiveValue: number;
  calculationType: IncentiveCalculationType;
  currencyType: CurrencyType;
}

export interface TieredIncentivePlan extends IncentivePlanBase {
  metricType: MetricType;
  tiers: TieredIncentiveTier[];
}

// Project
export interface Project {
  id: string;
  name: string;
  description: string;
  location?: string;
  propertyType?: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  dateListed?: string;
  status?: string;
  agentName?: string;
  agentContact?: string;
  imagesMedia?: string;
  amenities?: string;
  yearBuilt?: number;
  ownershipDetails?: string;
  listingExpiryDate?: string;
  mlsListingId?: string;
  totalValue?: number;
  isActive: boolean;
}

// Team
export interface Team {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId?: string;
  createdAt?: string;
  createdBy?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  members?: TeamMember[];
}

// Team Member
export interface TeamMember {
  id: string;
  teamId: string;
  teamName: string;
  userId: string;
  userName: string;
  role: string;
  isActive: boolean;
  joinedDate?: string;
  leftDate?: string;
}

// API Request/Response Types
export interface IncentivePlanListResponse {
  succeeded: boolean;
  message: string;
  data: IncentivePlanBase[];
}

export interface IncentivePlanResponse<T extends IncentivePlanBase> {
  succeeded: boolean;
  message: string;
  data: T;
}

export interface IncentivePlanFilters {
  planType?: IncentivePlanType;
  isActive?: boolean;
  search?: string;
}

export interface CreateIncentivePlanResponse {
  succeeded: boolean;
  planId: string;
  message: string;
}

export type CreateTargetBasedIncentivePlanRequest = Omit<TargetBasedIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>;
export type CreateRoleBasedIncentivePlanRequest = Omit<RoleBasedIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>;
export type CreateProjectBasedIncentivePlanRequest = Omit<ProjectBasedIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>;
export type CreateKickerIncentivePlanRequest = Omit<KickerIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>;
export type CreateTieredIncentivePlanRequest = Omit<TieredIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>;

export type UpdateTargetBasedIncentivePlanRequest = Partial<Omit<TargetBasedIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>>;
export type UpdateRoleBasedIncentivePlanRequest = Partial<Omit<RoleBasedIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>>;
export type UpdateProjectBasedIncentivePlanRequest = Partial<Omit<ProjectBasedIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>>;
export type UpdateKickerIncentivePlanRequest = Partial<Omit<KickerIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>>;
export type UpdateTieredIncentivePlanRequest = Partial<Omit<TieredIncentivePlan, 'id' | 'createdAt' | 'createdBy' | 'lastModifiedAt' | 'lastModifiedBy'>>;
