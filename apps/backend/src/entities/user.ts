// User entity interface
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Add any additional fields as required for your application
  bio?: string;
  location?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    [key: string]: any;
  };
}

// User creation request interface
export interface CreateUserRequest {
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    [key: string]: any;
  };
}

// User update request interface
export interface UpdateUserRequest {
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    [key: string]: any;
  };
}

// User response interface
export interface UserResponse {
  success: boolean;
  data?: User;
  message?: string;
  error?: any;
} 