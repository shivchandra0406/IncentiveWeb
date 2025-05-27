import enhancedApiClient from '../apiClientWrapper';
import type { Project } from '../../core/models/incentivePlanTypes';

export interface ProjectService {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project>;
  createProject(projectData: CreateProjectRequest): Promise<CreateProjectResponse>;
  updateProject(id: string, projectData: UpdateProjectRequest): Promise<CreateProjectResponse>;
  deleteProject(id: string): Promise<CreateProjectResponse>;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  location: string;
  propertyType: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  dateListed?: string;
  status: string;
  agentName: string;
  agentContact: string;
  imagesMedia: string;
  amenities: string;
  yearBuilt: number;
  ownershipDetails: string;
  listingExpiryDate?: string;
  mlsListingId: string;
  totalValue: number;
  isActive: boolean;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
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
  isActive?: boolean;
}

export interface CreateProjectResponse {
  succeeded: boolean;
  message: string;
  data: Project;
}

class ProjectServiceImpl implements ProjectService {
  async getProjects(): Promise<Project[]> {
    try {
      // Use the main API endpoint for projects list
      console.log('Fetching projects from https://localhost:44307/api/Project');
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, errors: string[], data: Project[] }>('https://localhost:44307/api/Project');
      console.log('Projects response:', response.data);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching projects:', error);

      // If the first endpoint fails, try the alternative endpoint
      try {
        console.log('Retrying with alternative endpoint: https://localhost:44307/api/Project');
        const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, errors: string[], data: Project[] }>('https://localhost:44307/api/Project');
        console.log('Projects response from alternative endpoint:', response.data);
        return response.data.data || [];
      } catch (retryError: any) {
        console.error('Error fetching projects from alternative endpoint:', retryError);
        return [];
      }
    }
  }

  async getProjectById(id: string): Promise<Project> {
    try {
      // Use the detailed API endpoint for getting a specific project
      console.log(`Fetching project details for ID: ${id}`);
      const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Project }>(`https://localhost:44307/api/Project/${id}`);
      console.log('Project details response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching project with ID ${id}:`, error);

      // If the first endpoint fails, try the alternative endpoint
      try {
        console.log(`Retrying with alternative endpoint: https://localhost:44307/api/Project/${id}`);
        const response = await enhancedApiClient.get<{ succeeded: boolean, message: string, data: Project }>(`https://localhost:44307/api/Project/${id}`);
        console.log('Project details response from alternative endpoint:', response.data);
        return response.data.data;
      } catch (retryError: any) {
        console.error(`Error fetching project with ID ${id} from alternative endpoint:`, retryError);
        throw retryError;
      }
    }
  }

  async createProject(projectData: CreateProjectRequest): Promise<CreateProjectResponse> {
    try {
      console.log('Creating new project with data:', projectData);
      const response = await enhancedApiClient.post<CreateProjectResponse>('https://localhost:44307/api/Project', projectData);
      console.log('Create project response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      console.error('Error response:', error.response?.data);

      // If the first endpoint fails, try the alternative endpoint
      try {
        console.log('Retrying with alternative endpoint: https://localhost:44307/api/Project');
        const response = await enhancedApiClient.post<CreateProjectResponse>('https://localhost:44307/api/Project', projectData);
        console.log('Create project response from alternative endpoint:', response.data);
        return response.data;
      } catch (retryError: any) {
        console.error('Error creating project with alternative endpoint:', retryError);
        console.error('Error response from alternative endpoint:', retryError.response?.data);
        return {
          succeeded: false,
          message: retryError.response?.data?.message || retryError.message || 'Failed to create project',
          data: null as any
        };
      }
    }
  }

  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<CreateProjectResponse> {
    try {
      console.log(`Updating project with ID ${id}:`, projectData);
      const response = await enhancedApiClient.put<CreateProjectResponse>(`https://localhost:44307/api/Project/${id}`, projectData);
      console.log('Update project response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating project:', error);
      console.error('Error response:', error.response?.data);

      // If the first endpoint fails, try the alternative endpoint
      try {
        console.log(`Retrying with alternative endpoint: https://localhost:44307/api/Project/${id}`);
        const response = await enhancedApiClient.put<CreateProjectResponse>(`https://localhost:44307/api/Project/${id}`, projectData);
        console.log('Update project response from alternative endpoint:', response.data);
        return response.data;
      } catch (retryError: any) {
        console.error('Error updating project with alternative endpoint:', retryError);
        console.error('Error response from alternative endpoint:', retryError.response?.data);
        return {
          succeeded: false,
          message: retryError.response?.data?.message || retryError.message || 'Failed to update project',
          data: null as any
        };
      }
    }
  }

  async deleteProject(id: string): Promise<CreateProjectResponse> {
    try {
      console.log(`Deleting project with ID ${id}`);
      const response = await enhancedApiClient.delete<CreateProjectResponse>(`https://localhost:44307/api/Project/${id}`);
      console.log('Delete project response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting project:', error);
      console.error('Error response:', error.response?.data);

      // If the first endpoint fails, try the alternative endpoint
      try {
        console.log(`Retrying with alternative endpoint: https://localhost:44307/api/Project/${id}`);
        const response = await enhancedApiClient.delete<CreateProjectResponse>(`https://localhost:44307/api/Project/${id}`);
        console.log('Delete project response from alternative endpoint:', response.data);
        return response.data;
      } catch (retryError: any) {
        console.error('Error deleting project with alternative endpoint:', retryError);
        console.error('Error response from alternative endpoint:', retryError.response?.data);
        return {
          succeeded: false,
          message: retryError.response?.data?.message || retryError.message || 'Failed to delete project',
          data: null as any
        };
      }
    }
  }
}

export default new ProjectServiceImpl();
