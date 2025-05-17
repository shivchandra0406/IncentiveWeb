import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleClaim,
  CreateRoleClaimRequest,
  AssignRoleRequest,
  RoleListResponse,
  RoleResponse,
  RoleClaimsResponse
} from '../../core/models/role';
import type { RoleService } from '../../core/services/RoleService';
import enhancedApiClient from '../apiClientWrapper';

export class RoleServiceImpl implements RoleService {
  // Role CRUD operations
  async getRoles(): Promise<RoleListResponse> {
    const response = await enhancedApiClient.get<RoleListResponse>('/roles');
    return response.data;
  }

  async getRoleById(id: string): Promise<RoleResponse> {
    const response = await enhancedApiClient.get<RoleResponse>(`/roles/${id}`);
    return response.data;
  }

  async createRole(roleData: CreateRoleRequest): Promise<RoleResponse> {
    const response = await enhancedApiClient.post<RoleResponse>('/roles', roleData);
    return response.data;
  }

  async updateRole(id: string, roleData: UpdateRoleRequest): Promise<RoleResponse> {
    const response = await enhancedApiClient.put<RoleResponse>(`/roles/${id}`, roleData);
    return response.data;
  }

  async deleteRole(id: string): Promise<void> {
    await enhancedApiClient.delete(`/roles/${id}`);
  }

  // Role claims management
  async getRoleClaims(roleId: string): Promise<RoleClaimsResponse> {
    const response = await enhancedApiClient.get<RoleClaimsResponse>(`/roleclaims/${roleId}`);
    return response.data;
  }

  async addClaimToRole(request: CreateRoleClaimRequest): Promise<void> {
    await enhancedApiClient.post('/roleclaims', request);
  }

  // Role assignment
  async assignRoleToUser(request: AssignRoleRequest): Promise<void> {
    await enhancedApiClient.post('/roles/assign', request);
  }
}

export default new RoleServiceImpl();
