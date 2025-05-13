import type {
  ChangePasswordRequest,
  CreateUserRequest,
  ResetPasswordRequest,
  RoleClaimRequest,
  UpdateUserRequest,
  User,
  UserClaim,
  UserClaimsRequest,
  UserFilters,
  UserListResponse,
  UserResponse,
  UserResponseDto,
  UserRolesRequest
} from '../models/user';

export interface UserService {
  // User CRUD operations
  getUsers(filters?: UserFilters, page?: number, limit?: number): Promise<UserListResponse>;
  getUserById(id: string): Promise<UserResponse>;
  createUser(userData: CreateUserRequest): Promise<UserResponseDto>;
  updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponseDto>;
  deleteUser(id: string): Promise<UserResponseDto>;

  // User roles management
  getUserRoles(id: string): Promise<string[]>;
  assignRolesToUser(request: UserRolesRequest): Promise<UserResponseDto>;

  // User claims management
  getUserClaims(id: string): Promise<UserClaim[]>;
  updateUserClaims(id: string, request: UserClaimsRequest): Promise<UserResponseDto>;
  addUserClaim(id: string, claim: RoleClaimRequest): Promise<UserResponseDto>;
  removeUserClaim(id: string, claim: RoleClaimRequest): Promise<UserResponseDto>;

  // Password management
  changePassword(request: ChangePasswordRequest): Promise<UserResponseDto>;
  resetPassword(request: ResetPasswordRequest): Promise<UserResponseDto>;
}
