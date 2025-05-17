import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  TargetType,
  IncentiveCalculationType,
  AwardType,
  CurrencyType
} from '../core/models/incentivePlanTypes';
import { IncentivePlanStatus, RewardType } from '../core/models/incentivePlan';
import { DealStatus } from '../core/models/deal';
import { UserRole } from '../core/models/auth';
import {
  WorkflowStatus,
  WorkflowStepType,
  WorkflowInstanceStatus,
  WorkflowStepExecutionStatus
} from '../core/models/workflow';
import { PayoutStatus } from '../core/models/payout';

// Numeric to String Enum Mappings
export const numericToIncentivePlanType: Record<number, IncentivePlanType> = {
  0: IncentivePlanType.TargetBased,
  1: IncentivePlanType.RoleBased,
  2: IncentivePlanType.ProjectBased,
  3: IncentivePlanType.KickerBased,
  4: IncentivePlanType.TieredBased
};

export const numericToPeriodType: Record<number, PeriodType> = {
  0: PeriodType.None,
  1: PeriodType.Monthly,
  2: PeriodType.Quarterly,
  3: PeriodType.HalfYearly,
  4: PeriodType.Yearly,
  5: PeriodType.Custom
};

export const numericToMetricType: Record<number, MetricType> = {
  0: MetricType.BookingValue,
  1: MetricType.UnitsSold,
  2: MetricType.Revenue
};

export const numericToTargetType: Record<number, TargetType> = {
  0: TargetType.SalaryBased,
  1: TargetType.MetricBased
};

export const numericToIncentiveCalculationType: Record<number, IncentiveCalculationType> = {
  0: IncentiveCalculationType.FixedAmount,
  1: IncentiveCalculationType.PercentageOnTarget
};

export const numericToAwardType: Record<number, AwardType> = {
  0: AwardType.Cash,
  1: AwardType.Gift
};

export const numericToCurrencyType: Record<number, CurrencyType> = {
  0: CurrencyType.Rupees,
  1: CurrencyType.Dollar
};

export const numericToIncentivePlanStatus: Record<number, IncentivePlanStatus> = {
  0: IncentivePlanStatus.DRAFT,
  1: IncentivePlanStatus.ACTIVE,
  2: IncentivePlanStatus.INACTIVE,
  3: IncentivePlanStatus.EXPIRED
};

export const numericToRewardType: Record<number, RewardType> = {
  0: RewardType.FIXED,
  1: RewardType.PERCENTAGE,
  2: RewardType.POINTS
};

export const numericToDealStatus: Record<number, DealStatus> = {
  0: DealStatus.NEW,
  1: DealStatus.PENDING,
  2: DealStatus.NEGOTIATION,
  3: DealStatus.CLOSED_WON,
  4: DealStatus.CLOSED_LOST
};

export const numericToUserRole: Record<number, UserRole> = {
  0: UserRole.ADMIN,
  1: UserRole.MANAGER,
  2: UserRole.AGENT,
  3: UserRole.READONLY
};

export const numericToWorkflowStatus: Record<number, WorkflowStatus> = {
  0: WorkflowStatus.DRAFT,
  1: WorkflowStatus.ACTIVE,
  2: WorkflowStatus.INACTIVE
};

export const numericToWorkflowStepType: Record<number, WorkflowStepType> = {
  0: WorkflowStepType.APPROVAL,
  1: WorkflowStepType.NOTIFICATION,
  2: WorkflowStepType.CALCULATION,
  3: WorkflowStepType.CONDITION,
  4: WorkflowStepType.ACTION
};

export const numericToWorkflowInstanceStatus: Record<number, WorkflowInstanceStatus> = {
  0: WorkflowInstanceStatus.RUNNING,
  1: WorkflowInstanceStatus.COMPLETED,
  2: WorkflowInstanceStatus.FAILED,
  4: WorkflowInstanceStatus.CANCELLED,
  5: WorkflowInstanceStatus.WAITING
};

export const numericToWorkflowStepExecutionStatus: Record<number, WorkflowStepExecutionStatus> = {
  0: WorkflowStepExecutionStatus.PENDING,
  1: WorkflowStepExecutionStatus.COMPLETED,
  2: WorkflowStepExecutionStatus.FAILED,
  3: WorkflowStepExecutionStatus.SKIPPED
};

export const numericToPayoutStatus: Record<number, PayoutStatus> = {
  0: PayoutStatus.PENDING,
  1: PayoutStatus.APPROVED,
  2: PayoutStatus.REJECTED,
  3: PayoutStatus.PAID
};

// String to Numeric Enum Mappings (reverse mappings)
export const incentivePlanTypeToNumeric: Record<IncentivePlanType, number> = {
  [IncentivePlanType.TargetBased]: 0,
  [IncentivePlanType.RoleBased]: 1,
  [IncentivePlanType.ProjectBased]: 2,
  [IncentivePlanType.KickerBased]: 3,
  [IncentivePlanType.TieredBased]: 4
};

export const periodTypeToNumeric: Record<PeriodType, number> = {
  [PeriodType.None]: 0,
  [PeriodType.Monthly]: 1,
  [PeriodType.Quarterly]: 2,
  [PeriodType.HalfYearly]: 3,
  [PeriodType.Yearly]: 4,
  [PeriodType.Custom]: 5
};

export const metricTypeToNumeric: Record<MetricType, number> = {
  [MetricType.BookingValue]: 0,
  [MetricType.UnitsSold]: 1,
  [MetricType.Revenue]: 2
};

export const targetTypeToNumeric: Record<TargetType, number> = {
  [TargetType.SalaryBased]: 0,
  [TargetType.MetricBased]: 1
};

export const incentiveCalculationTypeToNumeric: Record<IncentiveCalculationType, number> = {
  [IncentiveCalculationType.FixedAmount]: 0,
  [IncentiveCalculationType.PercentageOnTarget]: 1
};

export const awardTypeToNumeric: Record<AwardType, number> = {
  [AwardType.Cash]: 0,
  [AwardType.Gift]: 1
};

export const currencyTypeToNumeric: Record<CurrencyType, number> = {
  [CurrencyType.Rupees]: 0,
  [CurrencyType.Dollar]: 1
};

export const incentivePlanStatusToNumeric: Record<IncentivePlanStatus, number> = {
  [IncentivePlanStatus.DRAFT]: 0,
  [IncentivePlanStatus.ACTIVE]: 1,
  [IncentivePlanStatus.INACTIVE]: 2,
  [IncentivePlanStatus.EXPIRED]: 3
};

export const rewardTypeToNumeric: Record<RewardType, number> = {
  [RewardType.FIXED]: 0,
  [RewardType.PERCENTAGE]: 1,
  [RewardType.POINTS]: 2
};

export const dealStatusToNumeric: Record<DealStatus, number> = {
  [DealStatus.NEW]: 0,
  [DealStatus.PENDING]: 1,
  [DealStatus.NEGOTIATION]: 2,
  [DealStatus.CLOSED_WON]: 3,
  [DealStatus.CLOSED_LOST]:4,
};

export const userRoleToNumeric: Record<UserRole, number> = {
  [UserRole.ADMIN]: 0,
  [UserRole.MANAGER]: 1,
  [UserRole.AGENT]: 2,
  [UserRole.READONLY]: 2
};

export const workflowStatusToNumeric: Record<WorkflowStatus, number> = {
  [WorkflowStatus.DRAFT]: 0,
  [WorkflowStatus.ACTIVE]: 1,
  [WorkflowStatus.INACTIVE]: 2
};

export const workflowStepTypeToNumeric: Record<WorkflowStepType, number> = {
  [WorkflowStepType.APPROVAL]: 0,
  [WorkflowStepType.NOTIFICATION]: 1,
  [WorkflowStepType.CALCULATION]: 2,
  [WorkflowStepType.CONDITION]: 3,
  [WorkflowStepType.ACTION]: 4
};

export const workflowInstanceStatusToNumeric: Record<WorkflowInstanceStatus, number> = {
  [WorkflowInstanceStatus.RUNNING]: 0,
  [WorkflowInstanceStatus.COMPLETED]: 1,
  [WorkflowInstanceStatus.FAILED]: 2,
  [WorkflowInstanceStatus.CANCELLED]: 3,
  [WorkflowInstanceStatus.WAITING]: 4
};

export const workflowStepExecutionStatusToNumeric: Record<WorkflowStepExecutionStatus, number> = {
  [WorkflowStepExecutionStatus.PENDING]: 0,
  [WorkflowStepExecutionStatus.COMPLETED]: 1,
  [WorkflowStepExecutionStatus.FAILED]: 2,
  [WorkflowStepExecutionStatus.SKIPPED]: 3
};

export const payoutStatusToNumeric: Record<PayoutStatus, number> = {
  [PayoutStatus.PENDING]: 0,
  [PayoutStatus.APPROVED]: 1,
  [PayoutStatus.REJECTED]: 2,
  [PayoutStatus.PAID]: 3
};

// Utility functions for mapping
export function mapNumericToEnum<T>(value: number | string | T, mapper: Record<number, T>): T {
  if (typeof value === 'number') {
    return mapper[value] || Object.values(mapper)[0]; // Return first enum value as fallback
  }

  if (typeof value === 'string' && !isNaN(Number(value))) {
    return mapper[Number(value)] || Object.values(mapper)[0];
  }

  return value as T;
}

export function mapEnumToNumeric<T extends string>(value: T, mapper: Record<T, number>): number {
  return mapper[value] || 1; // Default to 1 if not found
}

// Helper functions for specific enum types
export function getIncentivePlanTypeFromNumeric(value: number | string | IncentivePlanType): IncentivePlanType {
  console.log("getIncentivePlanTypeFromNumeric: ", value);

  return mapNumericToEnum(value, numericToIncentivePlanType);
}

export function getPeriodTypeFromNumeric(value: number | string | PeriodType): PeriodType {
  return mapNumericToEnum(value, numericToPeriodType);
}

export function getMetricTypeFromNumeric(value: number | string | MetricType): MetricType {
  return mapNumericToEnum(value, numericToMetricType);
}

export function getTargetTypeFromNumeric(value: number | string | TargetType): TargetType {
  return mapNumericToEnum(value, numericToTargetType);
}

export function getIncentiveCalculationTypeFromNumeric(value: number | string | IncentiveCalculationType): IncentiveCalculationType {
  return mapNumericToEnum(value, numericToIncentiveCalculationType);
}

export function getAwardTypeFromNumeric(value: number | string | AwardType): AwardType {
  return mapNumericToEnum(value, numericToAwardType);
}

export function getCurrencyTypeFromNumeric(value: number | string | CurrencyType): CurrencyType {
  return mapNumericToEnum(value, numericToCurrencyType);
}

export function getIncentivePlanStatusFromNumeric(value: number | string | IncentivePlanStatus): IncentivePlanStatus {
  return mapNumericToEnum(value, numericToIncentivePlanStatus);
}

export function getRewardTypeFromNumeric(value: number | string | RewardType): RewardType {
  return mapNumericToEnum(value, numericToRewardType);
}

export function getDealStatusFromNumeric(value: number | string | DealStatus): DealStatus {
  return mapNumericToEnum(value, numericToDealStatus);
}

export function getUserRoleFromNumeric(value: number | string | UserRole): UserRole {
  return mapNumericToEnum(value, numericToUserRole);
}

export function getWorkflowStatusFromNumeric(value: number | string | WorkflowStatus): WorkflowStatus {
  return mapNumericToEnum(value, numericToWorkflowStatus);
}

export function getWorkflowStepTypeFromNumeric(value: number | string | WorkflowStepType): WorkflowStepType {
  return mapNumericToEnum(value, numericToWorkflowStepType);
}

export function getWorkflowInstanceStatusFromNumeric(value: number | string | WorkflowInstanceStatus): WorkflowInstanceStatus {
  return mapNumericToEnum(value, numericToWorkflowInstanceStatus);
}

export function getWorkflowStepExecutionStatusFromNumeric(value: number | string | WorkflowStepExecutionStatus): WorkflowStepExecutionStatus {
  return mapNumericToEnum(value, numericToWorkflowStepExecutionStatus);
}

export function getPayoutStatusFromNumeric(value: number | string | PayoutStatus): PayoutStatus {
  return mapNumericToEnum(value, numericToPayoutStatus);
}
