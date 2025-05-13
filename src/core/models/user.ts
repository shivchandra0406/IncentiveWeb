export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  roles: string[];
  claims?: UserClaim[];
}

export interface UserClaim {
  claimType: string;
  claimValue: string;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  isActive: boolean;
  roles: string[];
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface UserResponseDto {
  succeeded: boolean;
  userId: string;
  message: string;
}

export interface UserListResponse {
  succeeded: boolean;
  message: string;
  data: User[];
}

export interface UserResponse {
  succeeded: boolean;
  message: string;
  data: User;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserRolesRequest {
  userId: string;
  roles: string[];
}

export interface UserClaimsRequest {
  userId: string;
  claims: UserClaim[];
}

export interface RoleClaimRequest {
  claimType: string;
  claimValue: string;
}
