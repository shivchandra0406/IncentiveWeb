import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  User, 
  UserFilters, 
  UserListResponse 
} from '../../core/models/user';
import { UserService } from '../../core/services/UserService';
import apiClient from '../apiClient';

export class UserServiceImpl implements UserService {
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

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete<void>(`/users/${id}`);
  }

  async activateUser(id: string): Promise<User> {
    const response = await apiClient.post<User>(`/users/${id}/activate`);
    return response.data;
  }

  async deactivateUser(id: string): Promise<User> {
    const response = await apiClient.post<User>(`/users/${id}/deactivate`);
    return response.data;
  }
}

export default new UserServiceImpl();
