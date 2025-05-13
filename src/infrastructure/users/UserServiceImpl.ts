import type {
  ChangePasswordRequest,
  CreateUserRequest,
  ResetPasswordRequest,
  RoleClaimRequest,
  UpdateUserRequest,
  UserClaim,
  UserClaimsRequest,
  UserFilters,
  UserListResponse,
  UserResponse,
  UserResponseDto,
  UserRolesRequest
} from '../../core/models/user';
import { UserService } from '../../core/services/UserService';
import apiClient from '../apiClient';

export class UserServiceImpl implements UserService {
  // User CRUD operations
  async getUsers(filters?: UserFilters, page: number = 1, limit: number = 10): Promise<UserListResponse> {
    const response = await apiClient.get<UserListResponse>('/users', {
      params: {
        ...filters,
        page,
        limit
      }
    });
    return response.data;
  }

  async getUserById(id: string): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto>('/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponseDto> {
    const response = await apiClient.put<UserResponseDto>(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    const response = await apiClient.delete<UserResponseDto>(`/users/${id}`);
    return response.data;
  }

  // User roles management
  async getUserRoles(id: string): Promise<string[]> {
    const response = await apiClient.get<{ succeeded: boolean, message: string, data: string[] }>(`/users/${id}/roles`);
    return response.data.data;
  }

  async assignRolesToUser(request: UserRolesRequest): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto>(`/users/${request.userId}/roles`, request);
    return response.data;
  }

  // User claims management
  async getUserClaims(id: string): Promise<UserClaim[]> {
    const response = await apiClient.get<{ succeeded: boolean, message: string, data: UserClaim[] }>(`/users/${id}/claims`);
    return response.data.data;
  }

  async updateUserClaims(id: string, request: UserClaimsRequest): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto>(`/users/${id}/claims`, request);
    return response.data;
  }

  async addUserClaim(id: string, claim: RoleClaimRequest): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto>(`/users/${id}/claims/add`, claim);
    return response.data;
  }

  async removeUserClaim(id: string, claim: RoleClaimRequest): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto>(`/users/${id}/claims/remove`, claim);
    return response.data;
  }

  // Password management
  async changePassword(request: ChangePasswordRequest): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto>('/users/change-password', request);
    return response.data;
  }

  async resetPassword(request: ResetPasswordRequest): Promise<UserResponseDto> {
    const response = await apiClient.post<UserResponseDto>('/users/reset-password', request);
    return response.data;
  }
}

export default new UserServiceImpl();
