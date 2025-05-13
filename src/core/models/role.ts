export interface Role {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  name: string;
  description: string;
}

export interface RoleClaim {
  roleId: string;
  claimType: string;
  claimValue: string;
}

export interface CreateRoleClaimRequest {
  roleId: string;
  claimType: string;
  claimValue: string;
}

export interface AssignRoleRequest {
  userId: string;
  roleName: string;
}

export interface RoleListResponse {
  succeeded: boolean;
  message: string;
  data: Role[];
}

export interface RoleResponse {
  succeeded: boolean;
  message: string;
  data: Role;
}

export interface RoleClaimsResponse {
  succeeded: boolean;
  message: string;
  data: RoleClaim[];
}
