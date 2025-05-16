import apiClient from './apiClient';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  // Numeric to enum converters
  getIncentivePlanTypeFromNumeric,
  getPeriodTypeFromNumeric,
  getMetricTypeFromNumeric,
  getTargetTypeFromNumeric,
  getIncentiveCalculationTypeFromNumeric,
  getAwardTypeFromNumeric,
  getIncentivePlanStatusFromNumeric,
  getRewardTypeFromNumeric,
  getDealStatusFromNumeric,
  getUserRoleFromNumeric,
  getWorkflowStatusFromNumeric,
  getWorkflowStepTypeFromNumeric,
  getWorkflowInstanceStatusFromNumeric,
  getWorkflowStepExecutionStatusFromNumeric,
  getPayoutStatusFromNumeric,

  // Enum to numeric converters
  incentivePlanTypeToNumeric,
  periodTypeToNumeric,
  metricTypeToNumeric,
  targetTypeToNumeric,
  incentiveCalculationTypeToNumeric,
  awardTypeToNumeric,
  incentivePlanStatusToNumeric,
  rewardTypeToNumeric,
  dealStatusToNumeric,
  userRoleToNumeric,
  workflowStatusToNumeric,
  workflowStepTypeToNumeric,
  workflowInstanceStatusToNumeric,
  workflowStepExecutionStatusToNumeric,
  payoutStatusToNumeric
} from '../utils/enumMappers';

// Helper function to recursively process response data (API to client)
function processResponseData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => processResponseData(item));
  }

  if (typeof data === 'object') {
    const result: Record<string, any> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];

        // Process specific enum fields based on their key names
        if (key === 'planType') {
          result[key] = getIncentivePlanTypeFromNumeric(value);
        } else if (key === 'periodType') {
          result[key] = getPeriodTypeFromNumeric(value);
        } else if (key === 'metricType') {
          result[key] = getMetricTypeFromNumeric(value);
        } else if (key === 'targetType') {
          result[key] = getTargetTypeFromNumeric(value);
        } else if (key === 'calculationType') {
          result[key] = getIncentiveCalculationTypeFromNumeric(value);
        } else if (key === 'awardType') {
          result[key] = getAwardTypeFromNumeric(value);
        } else if (key === 'status' && typeof value === 'number') {
          // Determine which status enum to use based on context
          if (key.includes('incentivePlan') || key.includes('plan')) {
            result[key] = getIncentivePlanStatusFromNumeric(value);
          } else if (key.includes('deal')) {
            result[key] = getDealStatusFromNumeric(value);
          } else if (key.includes('workflow') && !key.includes('step')) {
            result[key] = getWorkflowStatusFromNumeric(value);
          } else if (key.includes('workflowStep')) {
            result[key] = getWorkflowStepExecutionStatusFromNumeric(value);
          } else if (key.includes('workflowInstance')) {
            result[key] = getWorkflowInstanceStatusFromNumeric(value);
          } else if (key.includes('payout')) {
            result[key] = getPayoutStatusFromNumeric(value);
          }
        } else if (key === 'role' && typeof value === 'number') {
          result[key] = getUserRoleFromNumeric(value);
        } else if (key === 'type' && typeof value === 'number') {
          // Determine which type enum to use based on context
          if (key.includes('reward')) {
            result[key] = getRewardTypeFromNumeric(value);
          } else if (key.includes('workflowStep')) {
            result[key] = getWorkflowStepTypeFromNumeric(value);
          }
        } else if (typeof value === 'object' || Array.isArray(value)) {
          // Recursively process nested objects and arrays
          result[key] = processResponseData(value);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  return data;
}

// Helper function to recursively process request data (client to API)
export function processRequestData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => processRequestData(item));
  }

  if (typeof data === 'object') {
    const result: Record<string, any> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];

        // Convert string enum values to numeric values for API
        if (key === 'planType' && typeof value === 'string') {
          result[key] = incentivePlanTypeToNumeric[value as keyof typeof incentivePlanTypeToNumeric] || value;
        } else if (key === 'periodType' && typeof value === 'string') {
          result[key] = periodTypeToNumeric[value as keyof typeof periodTypeToNumeric] || value;
        } else if (key === 'metricType' && typeof value === 'string') {
          result[key] = metricTypeToNumeric[value as keyof typeof metricTypeToNumeric] || value;
        } else if (key === 'targetType' && typeof value === 'string') {
          result[key] = targetTypeToNumeric[value as keyof typeof targetTypeToNumeric] || value;
        } else if (key === 'calculationType' && typeof value === 'string') {
          result[key] = incentiveCalculationTypeToNumeric[value as keyof typeof incentiveCalculationTypeToNumeric] || value;
        } else if (key === 'awardType' && typeof value === 'string') {
          result[key] = awardTypeToNumeric[value as keyof typeof awardTypeToNumeric] || value;
        } else if (key === 'status' && typeof value === 'string') {
          // Determine which status enum to use based on context
          if (key.includes('incentivePlan') || key.includes('plan')) {
            result[key] = incentivePlanStatusToNumeric[value as keyof typeof incentivePlanStatusToNumeric] || value;
          } else if (key.includes('deal')) {
            result[key] = dealStatusToNumeric[value as keyof typeof dealStatusToNumeric] || value;
          } else if (key.includes('workflow') && !key.includes('step')) {
            result[key] = workflowStatusToNumeric[value as keyof typeof workflowStatusToNumeric] || value;
          } else if (key.includes('workflowStep')) {
            result[key] = workflowStepExecutionStatusToNumeric[value as keyof typeof workflowStepExecutionStatusToNumeric] || value;
          } else if (key.includes('workflowInstance')) {
            result[key] = workflowInstanceStatusToNumeric[value as keyof typeof workflowInstanceStatusToNumeric] || value;
          } else if (key.includes('payout')) {
            result[key] = payoutStatusToNumeric[value as keyof typeof payoutStatusToNumeric] || value;
          }
        } else if (key === 'role' && typeof value === 'string') {
          result[key] = userRoleToNumeric[value as keyof typeof userRoleToNumeric] || value;
        } else if (key === 'type' && typeof value === 'string') {
          // Determine which type enum to use based on context
          if (key.includes('reward')) {
            result[key] = rewardTypeToNumeric[value as keyof typeof rewardTypeToNumeric] || value;
          } else if (key.includes('workflowStep')) {
            result[key] = workflowStepTypeToNumeric[value as keyof typeof workflowStepTypeToNumeric] || value;
          }
        } else if (typeof value === 'object' && value !== null) {
          // Recursively process nested objects and arrays
          result[key] = processRequestData(value);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  return data;
}

// Enhanced API client with enum mapping
export const enhancedApiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Process any query parameters in the config
    const processedConfig = config ? {
      ...config,
      params: config.params ? processRequestData(config.params) : undefined
    } : config;

    const response = await apiClient.get<T>(url, processedConfig);

    // Process the response data to convert numeric enums to string enums
    if (response.data) {
      console.log("response.data:", response.data);
      response.data = processResponseData(response.data) as T;
      console.log("response.data: after:", response.data);
    }

    return response;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Process request data to convert string enums to numeric enums
    const processedData = data ? processRequestData(data) : data;

    // Debug log to verify enum conversion
    // Uncomment for debugging
    // console.log('Original data:', data);
    // console.log('Processed data (with numeric enums):', processedData);

    const response = await apiClient.post<T>(url, processedData, config);

    if (response.data) {
      response.data = processResponseData(response.data) as T;
    }

    return response;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Process request data to convert string enums to numeric enums
    const processedData = data ? processRequestData(data) : data;

    // Debug log to verify enum conversion
    // Uncomment for debugging
    // console.log('Original data:', data);
    // console.log('Processed data (with numeric enums):', processedData);

    const response = await apiClient.put<T>(url, processedData, config);

    if (response.data) {
      response.data = processResponseData(response.data) as T;
    }

    return response;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Process request data to convert string enums to numeric enums
    const processedData = data ? processRequestData(data) : data;

    const response = await apiClient.patch<T>(url, processedData, config);

    if (response.data) {
      response.data = processResponseData(response.data) as T;
    }

    return response;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    const response = await apiClient.delete<T>(url, config);

    if (response.data) {
      response.data = processResponseData(response.data) as T;
    }

    return response;
  },
};

export default enhancedApiClient;
