import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  User, 
  UserFilters, 
  UserListResponse 
} from '../models/user';

export interface UserService {
  getUsers(filters?: UserFilters, page?: number, limit?: number): Promise<UserListResponse>;
  getUserById(id: string): Promise<User>;
  createUser(userData: CreateUserRequest): Promise<User>;
  updateUser(id: string, userData: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
  activateUser(id: string): Promise<User>;
  deactivateUser(id: string): Promise<User>;
}
