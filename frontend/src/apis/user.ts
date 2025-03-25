import axios from 'axios';
import { auth } from '../firebase/config';
import { User } from '../store/userSlice';

// Set base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Functions
export const getUserData = async (userId: string = 'me') => {
  return api.get<{ success: boolean; data: User; message: string }>(`/users/${userId}`);
};

export const updateUserData = async (userId: string = 'me', userData: Partial<User>) => {
  return api.put<{ success: boolean; data: User; message: string }>(`/users/${userId}`, userData);
};

export const registerUser = async (email: string, password: string, displayName?: string, photoURL?: string) => {
  return api.post<{ success: boolean; data: User; message: string }>('/auth/register', {
    email,
    password,
    displayName,
    photoURL
  });
};

export const deleteUser = async (userId: string = 'me') => {
  return api.delete<{ success: boolean; message: string }>(`/auth/users/${userId}`);
};

// For testing with Firebase Emulator
export const configureApiForEmulator = () => {
  // Update base URL to point to emulator
  api.defaults.baseURL = 'http://localhost:5001/buddy-connect/us-central1/api';
};

export default api; 