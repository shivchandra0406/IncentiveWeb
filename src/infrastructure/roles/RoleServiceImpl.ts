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
import apiClient from '../apiClient';

export class RoleServiceImpl implements RoleService {
  // Role CRUD operations
  async getRoles(): Promise<RoleListResponse> {
    const response = await apiClient.get<RoleListResponse>('/roles');
    return response.data;
  }

  async getRoleById(id: string): Promise<RoleResponse> {
    const response = await apiClient.get<RoleResponse>(`/roles/${id}`);
    return response.data;
  }

  async createRole(roleData: CreateRoleRequest): Promise<RoleResponse> {
    const response = await apiClient.post<RoleResponse>('/roles', roleData);
    return response.data;
  }

  async updateRole(id: string, roleData: UpdateRoleRequest): Promise<RoleResponse> {
    const response = await apiClient.put<RoleResponse>(`/roles/${id}`, roleData);
    return response.data;
  }

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/roles/${id}`);
  }

  // Role claims management
  async getRoleClaims(roleId: string): Promise<RoleClaimsResponse> {
    const response = await apiClient.get<RoleClaimsResponse>(`/roleclaims/${roleId}`);
    return response.data;
  }

  async addClaimToRole(request: CreateRoleClaimRequest): Promise<void> {
    await apiClient.post('/roleclaims', request);
  }

  // Role assignment
  async assignRoleToUser(request: AssignRoleRequest): Promise<void> {
    await apiClient.post('/roles/assign', request);
  }
}

export default new RoleServiceImpl();
