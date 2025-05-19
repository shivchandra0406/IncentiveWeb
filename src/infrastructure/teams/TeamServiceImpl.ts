import enhancedApiClient from '../apiClientWrapper';
import type { TeamService } from '../../core/services/TeamService';
import type { Team } from '../../core/models/incentivePlanTypes';

class TeamServiceImpl implements TeamService {
  async getTeams(): Promise<{ succeeded: boolean, message: string, data: Team[] }> {
    try {
      console.log('Fetching teams');
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Team[] }>('/teams');
      console.log('Teams response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch teams');
    }
  }

  async getTeamById(id: string): Promise<{ succeeded: boolean, message: string, data: Team }> {
    try {
      console.log(`Fetching team with ID: ${id}`);
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Team }>(`/teams/${id}`);
      console.log('Team response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching team with ID ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || `Failed to fetch team with ID ${id}`);
    }
  }

  async getTeamsMinimal(): Promise<{ succeeded: boolean, message: string, data: Team[] }> {
    try {
      console.log('Fetching minimal teams');
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Team[] }>('/Teams/minimal');
      console.log('Minimal teams response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching minimal teams:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch minimal teams');
    }
  }
}

export default new TeamServiceImpl();
