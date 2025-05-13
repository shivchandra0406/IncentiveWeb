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
} from '../models/role';

export type RoleService = {
  // Role CRUD operations
  getRoles(): Promise<RoleListResponse>;
  getRoleById(id: string): Promise<RoleResponse>;
  createRole(roleData: CreateRoleRequest): Promise<RoleResponse>;
  updateRole(id: string, roleData: UpdateRoleRequest): Promise<RoleResponse>;
  deleteRole(id: string): Promise<void>;
  
  // Role claims management
  getRoleClaims(roleId: string): Promise<RoleClaimsResponse>;
  addClaimToRole(request: CreateRoleClaimRequest): Promise<void>;
  
  // Role assignment
  assignRoleToUser(request: AssignRoleRequest): Promise<void>;
};
