import * as AuthModels from '../../core/models/auth';
import type { AuthService } from '../../core/services/AuthService';
import axios from 'axios';

// Type aliases for better readability
type LoginCredentials = AuthModels.LoginCredentials;
type LoginResponse = AuthModels.LoginResponse;
type RefreshTokenResponse = AuthModels.RefreshTokenResponse;
type RegisterUserData = AuthModels.RegisterUserData;
type User = AuthModels.User;
type UserRole = AuthModels.UserRole;

// API base URL
const API_BASE_URL = 'https://localhost:44307/api';

export class AuthServiceImpl implements AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Auth/login`,
        {
          userName: credentials.email,
          password: credentials.password
        },
        {
          headers: {
            'accept': 'text/plain',
            'tenantId': 'root',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.succeeded) {
        const userData = response.data.data;

        // Map API response to our User model
        const user: User = {
          id: userData.userId,
          username: userData.userName,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.roles[0] as UserRole, // Assuming first role is primary
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return {
          user,
          token: userData.token,
          refreshToken: userData.refreshToken
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterUserData): Promise<User> {
    console.log('Register attempt with:', userData);

    // In a real implementation, this would call the API
    // const response = await apiClient.post<User>('/auth/register', userData);
    // return response.data;

    // Not implemented yet
    throw new Error('Register functionality not implemented');
  }

  async logout(): Promise<void> {
    // For this implementation, we'll just clear local storage
    // In a real implementation with server-side sessions, you would call the API
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    return Promise.resolve();
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await axios.post(
        `${API_BASE_URL}/Auth/refresh-token`,
        {
          token: token,
          refreshToken: refreshToken
        },
        {
          headers: {
            'accept': 'text/plain',
            'tenantId': 'root',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.succeeded) {
        return { token: response.data.data.token };
      } else {
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    // Get user from localStorage
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('User not found');
    }

    try {
      const parsedUser = JSON.parse(userData);
      return {
        id: parsedUser.userId,
        username: parsedUser.userName,
        email: parsedUser.email,
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        role: parsedUser.roles[0] as UserRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      throw new Error('Invalid user data');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    console.log('Forgot password attempt for:', email);
    // Not implemented yet
    throw new Error('Forgot password functionality not implemented');
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    console.log('Reset password attempt with token:', token);
    // Not implemented yet
    throw new Error('Reset password functionality not implemented');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    console.log('Change password attempt');
    // Not implemented yet
    throw new Error('Change password functionality not implemented');
  }
}

export default new AuthServiceImpl();
