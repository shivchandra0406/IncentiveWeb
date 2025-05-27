import {
  IncentivePlanType,
  PeriodType,
  MetricType,
  TargetType,
  IncentiveCalculationType,
  AwardType,
  CurrencyType
} from '../core/models/incentivePlanTypes';
import {
  incentivePlanTypeToNumeric,
  periodTypeToNumeric,
  metricTypeToNumeric,
  targetTypeToNumeric,
  incentiveCalculationTypeToNumeric,
  awardTypeToNumeric,
  currencyTypeToNumeric,
  convertEnumValuesToNumeric
} from './enumMappers';
import { processRequestData } from '../infrastructure/apiClientWrapper';

// Sample data with string enum values
const sampleData = {
  planName: "Test Target Plan",
  planType: IncentivePlanType.TargetBased,
  periodType: PeriodType.Custom,
  startDate: "2025-05-15T00:00:00.000Z",
  endDate: "2025-05-31T00:00:00.000Z",
  isActive: true,
  targetType: TargetType.MetricBased,
  metricType: MetricType.UnitsSold,
  targetValue: 7,
  calculationType: IncentiveCalculationType.FixedAmount,
  incentiveValue: 5000,
  isCumulative: false,
  incentiveAfterExceedingTarget: false,
  includeSalaryInTarget: false,
  provideAdditionalIncentiveOnExceeding: false
};

// Function to test enum mapping
export function testEnumMapping() {
  console.log('Testing enum mapping...');

  // Test individual enum mappings
  console.log('IncentivePlanType.TargetBased:', IncentivePlanType.TargetBased, '→', incentivePlanTypeToNumeric[IncentivePlanType.TargetBased]);
  console.log('PeriodType.Custom:', PeriodType.Custom, '→', periodTypeToNumeric[PeriodType.Custom]);
  console.log('MetricType.UnitsSold:', MetricType.UnitsSold, '→', metricTypeToNumeric[MetricType.UnitsSold]);
  console.log('TargetType.MetricBased:', TargetType.MetricBased, '→', targetTypeToNumeric[TargetType.MetricBased]);
  console.log('IncentiveCalculationType.FixedAmount:', IncentiveCalculationType.FixedAmount, '→', incentiveCalculationTypeToNumeric[IncentiveCalculationType.FixedAmount]);
  console.log('AwardType.Cash:', AwardType.Cash, '→', awardTypeToNumeric[AwardType.Cash]);

  // Test processRequestData function
  const processedData = processRequestData(sampleData);
  console.log('Original data:', sampleData);
  console.log('Processed data (with numeric enums):', processedData);

  return processedData;
}

// Test for the new convertEnumValuesToNumeric function
export function testConvertEnumValuesToNumeric() {
  console.log('Testing convertEnumValuesToNumeric function...');

  // Test data similar to the one provided
  const testData = {
    planName: "new Target based incentive",
    planType: 0,
    periodType: 1,
    isActive: true,
    targetType: 0,
    salary: 25000,
    metricType: 2,
    targetValue: 124999,
    calculationType: 1,
    incentiveValue: 5,
    currencyType: "Rupees",
    isCumulative: false,
    incentiveAfterExceedingTarget: false,
    includeSalaryInTarget: false,
    provideAdditionalIncentiveOnExceeding: true,
    additionalIncentivePercentage: 6
  };

  // Run the test
  console.log('Original data:', testData);
  const convertedData = convertEnumValuesToNumeric(testData);
  console.log('Converted data:', convertedData);

  // Check if currencyType was converted correctly
  console.log('CurrencyType converted correctly:',
    typeof convertedData.currencyType === 'number' &&
    convertedData.currencyType === 0
  );

  return convertedData;
}

// Export the functions to make them available for testing
export default {
  testEnumMapping,
  testConvertEnumValuesToNumeric
};
