import { 
  LoginCredentials, 
  LoginResponse, 
  RefreshTokenResponse, 
  RegisterUserData, 
  User 
} from '../models/auth';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  register(userData: RegisterUserData): Promise<User>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
  getCurrentUser(): Promise<User>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
}
