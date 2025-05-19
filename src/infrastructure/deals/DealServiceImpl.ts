import enhancedApiClient from '../apiClientWrapper';
import type { DealService } from '../../core/services/DealService';
import type {
  Deal,
  DealFilters,
  DealListResponse,
  DealResponse,
  CreateDealRequest,
  UpdateDealRequest,
  DealStatus,
  CurrencyType
} from '../../core/models/deal';
import { dealStatusToNumeric, numericToDealStatus, currencyTypeToNumeric, numericToCurrencyType } from '../../utils/enumMappers';

class DealServiceImpl implements DealService {
  // Get all deals with optional filtering
  async getDeals(filters?: DealFilters, page: number = 1, limit: number = 10): Promise<DealListResponse> {
    try {
      console.log('Fetching deals with filters:', filters);

      // Convert any enum string values in filters to numeric values
      const apiFilters = { ...filters };
      if (filters?.status) {
        apiFilters.status = numericToDealStatus[filters.status];
      }

      const response = await enhancedApiClient.get<DealListResponse>('/Deals', {
        params: {
          ...apiFilters,
          page,
          limit
        }
      });

      // Log the raw API response to see the data structure
      console.log('Raw API response from DealService:', JSON.stringify(response.data, null, 2));
      
      // Create a clean response object with the data directly from the API
      const result: DealListResponse = {
        succeeded: response.data.succeeded,
        message: response.data.message,
        errors: response.data.errors || [],
        data: []
      };
      
      // If the API response has data, use it directly without any conversion
      if (response.data.succeeded && response.data.data) {
        // Log the first deal for debugging
        if (response.data.data.length > 0) {
          console.log('First deal from API:', JSON.stringify(response.data.data[0], null, 2));
          console.log('Status value:', response.data.data[0].status, 'Type:', typeof response.data.data[0].status);
        }
        
        // Assign the data array directly without any conversion
        result.data = response.data.data;
      }

      console.log('Deals response:', result);
      return result;
    } catch (error: any) {
      console.error('Error fetching deals:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch deals');
    }
  }

  // Get specific deal by ID
  async getDealById(id: string): Promise<DealResponse> {
    try {
      console.log(`Fetching deal with ID: ${id}`);
      const response = await enhancedApiClient.get<DealResponse>(`/Deals/${id}`);

      // Log the raw API response to see the data structure
      console.log('Raw deal by ID response:', JSON.stringify(response.data, null, 2));
      
      // Create a clean response object with the data directly from the API
      const result: DealResponse = {
        succeeded: response.data.succeeded,
        message: response.data.message,
        errors: response.data.errors || [],
        data: response.data.data || {} as Deal // Use empty object as fallback
      };
      
      // If the API response has data, use it directly without any conversion
      if (response.data.succeeded && response.data.data) {
        // Log the deal data for debugging
        console.log('Deal data from API:', JSON.stringify(response.data.data, null, 2));
        console.log('Status value:', response.data.data.status, 'Type:', typeof response.data.data.status);
        
        // Assign the data directly without any conversion
        result.data = response.data.data;
      }

      console.log('Deal response:', result);
      return result;
    } catch (error: any) {
      console.error(`Error fetching deal with ID ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || `Failed to fetch deal with ID ${id}`);
    }
  }

  // Create a new deal
  async createDeal(dealData: CreateDealRequest): Promise<DealResponse> {
    try {
      console.log('Creating new deal with data:', dealData);

      // Convert enum string values to numeric values for API
      const apiPayload = {
        ...dealData,
        status: dealStatusToNumeric[dealData.status],
        currencyType: currencyTypeToNumeric[dealData.currencyType]
      };

      console.log('Converted API payload:', apiPayload);
      const response = await enhancedApiClient.post<DealResponse>('/Deals', apiPayload);

      // Convert numeric enum values back to string values for UI
      if (response.data.succeeded && response.data.data) {
        this.convertDealEnumsToStrings(response.data.data);
      }

      console.log('Create deal response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating deal:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to create deal');
    }
  }

  // Update an existing deal
  async updateDeal(id: string, dealData: UpdateDealRequest): Promise<DealResponse> {
    try {
      console.log(`Updating deal with ID ${id} with data:`, dealData);

      // Convert enum string values to numeric values for API
      const apiPayload = {
        ...dealData,
        status: dealStatusToNumeric[dealData.status],
        currencyType: currencyTypeToNumeric[dealData.currencyType]
      };

      console.log('Converted API payload:', apiPayload);
      const response = await enhancedApiClient.put<DealResponse>(`/Deals/${id}`, apiPayload);

      // Convert numeric enum values back to string values for UI
      if (response.data.succeeded && response.data.data) {
        this.convertDealEnumsToStrings(response.data.data);
      }

      console.log('Update deal response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating deal with ID ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || `Failed to update deal with ID ${id}`);
    }
  }

  // Delete a deal
  async deleteDeal(id: string): Promise<{ succeeded: boolean, message: string }> {
    try {
      console.log(`Deleting deal with ID: ${id}`);
      const response = await enhancedApiClient.delete<{ succeeded: boolean, message: string }>(`/Deals/${id}`);
      console.log('Delete deal response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error deleting deal with ID ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || `Failed to delete deal with ID ${id}`);
    }
  }

  // Helper method to convert numeric enum values to string values
  private convertDealEnumsToStrings(deal: Deal): void {
    console.log('Converting deal enums for deal:', deal.id, 'Raw status:', deal.status, 'Type:', typeof deal.status);
    
    // Don't convert status - keep it as a numeric value for the UI to handle
    // This ensures the UI can properly map the numeric value to the correct string representation
    // The previous approach was causing issues because the conversion wasn't working correctly
    
    // Similarly, keep currencyType as a numeric value
    // This allows the UI to handle the conversion consistently

    // Convert enums in payments if they exist
    if (deal.payments && deal.payments.length > 0) {
      deal.payments.forEach(payment => {
        // Add any payment enum conversions here if needed
      });
    }

    // Convert enums in activities if they exist
    if (deal.activities && deal.activities.length > 0) {
      deal.activities.forEach(activity => {
        // Add any activity enum conversions here if needed
      });
    }
  }
}

export default new DealServiceImpl();
