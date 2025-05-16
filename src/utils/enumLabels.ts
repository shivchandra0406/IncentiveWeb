import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  TargetType,
  IncentiveCalculationType,
  AwardType
} from '../core/models/incentivePlanTypes';


// Human-readable labels for IncentivePlanType
export function getIncentivePlanTypeLabel(planType: IncentivePlanType | number | string): string {
   console.log("planType: ", planType);
  if (typeof planType === 'number') {
    switch (planType) {
      case 0: return 'Target Based';
      case 1: return 'Role Based';
      case 2: return 'Project Based';
      case 3: return 'Kicker Based';
      case 4: return 'Tiered Based';
      default: return 'Unknown';
    }
  }
  
  if (typeof planType === 'string' && !isNaN(Number(planType))) {
    return getIncentivePlanTypeLabel(Number(planType));
  }
  
  switch (planType as IncentivePlanType) {
    case IncentivePlanType.TargetBased: return 'Target Based';
    case IncentivePlanType.RoleBased: return 'Role Based';
    case IncentivePlanType.ProjectBased: return 'Project Based';
    case IncentivePlanType.KickerBased: return 'Kicker Based';
    case IncentivePlanType.TieredBased: return 'Tiered Based';
    default: return String(planType);
  }
}

// Human-readable labels for PeriodType
export function getPeriodTypeLabel(periodType: PeriodType | number | string): string {
  if (typeof periodType === 'number') {
    switch (periodType) {
      case 0: return 'None';
      case 1: return 'Monthly';
      case 2: return 'Quarterly';
      case 3: return 'Half Yearly';
      case 4: return 'Yearly';
      case 5: return 'Custom';
      default: return 'Unknown';
    }
  }
  
  if (typeof periodType === 'string' && !isNaN(Number(periodType))) {
    return getPeriodTypeLabel(Number(periodType));
  }
  
  switch (periodType as PeriodType) {
    case PeriodType.Monthly: return 'Monthly';
    case PeriodType.Quarterly: return 'Quarterly';
    case PeriodType.HalfYearly: return 'Half Yearly';
    case PeriodType.Yearly: return 'Yearly';
    case PeriodType.Custom: return 'Custom';
    default: return String(periodType);
  }
}

// Human-readable labels for MetricType
export function getMetricTypeLabel(metricType: MetricType | number | string): string {
  if (typeof metricType === 'number') {
    switch (metricType) {
      case 0: return 'Booking Value';
      case 1: return 'Units Sold';
      case 2: return 'Revenue';
      default: return 'Unknown';
    }
  }
  
  if (typeof metricType === 'string' && !isNaN(Number(metricType))) {
    return getMetricTypeLabel(Number(metricType));
  }
  
  switch (metricType as MetricType) {
    case MetricType.BookingValue: return 'Booking Value';
    case MetricType.UnitsSold: return 'Units Sold';
    case MetricType.Revenue: return 'Revenue';
    default: return String(metricType);
  }
}

// Human-readable labels for TargetType
export function getTargetTypeLabel(targetType: TargetType | number | string): string {
  if (typeof targetType === 'number') {
    switch (targetType) {
      case 0: return 'Salary Based';
      case 1: return 'Metric Based';
      default: return 'Unknown';
    }
  }
  
  if (typeof targetType === 'string' && !isNaN(Number(targetType))) {
    return getTargetTypeLabel(Number(targetType));
  }
  
  switch (targetType as TargetType) {
    case TargetType.SalaryBased: return 'Salary Based';
    case TargetType.MetricBased: return 'Metric Based';
    default: return String(targetType);
  }
}

// Human-readable labels for IncentiveCalculationType
export function getCalculationTypeLabel(calculationType: IncentiveCalculationType | number | string): string {
  if (typeof calculationType === 'number') {
    switch (calculationType) {
      case 0: return 'Fixed Amount';
      case 1: return 'Percentage on Target';
      default: return 'Unknown';
    }
  }
  
  if (typeof calculationType === 'string' && !isNaN(Number(calculationType))) {
    return getCalculationTypeLabel(Number(calculationType));
  }
  
  switch (calculationType as IncentiveCalculationType) {
    case IncentiveCalculationType.FixedAmount: return 'Fixed Amount';
    case IncentiveCalculationType.PercentageOnTarget: return 'Percentage on Target';
    default: return String(calculationType);
  }
}

// Human-readable labels for AwardType
export function getAwardTypeLabel(awardType: AwardType | number | string): string {
  if (typeof awardType === 'number') {
    switch (awardType) {
      case 0: return 'Cash';
      case 1: return 'Gift';
      default: return 'Unknown';
    }
  }
  
  if (typeof awardType === 'string' && !isNaN(Number(awardType))) {
    return getAwardTypeLabel(Number(awardType));
  }
  
  switch (awardType as AwardType) {
    case AwardType.Cash: return 'Cash';
    case AwardType.Gift: return 'Gift';
    default: return String(awardType);
  }
}
