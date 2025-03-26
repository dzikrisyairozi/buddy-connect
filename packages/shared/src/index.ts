// Base User interface
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
    [key: string]: unknown;
  };
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
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
    theme?: "light" | "dark";
    notifications?: boolean;
    [key: string]: unknown;
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
    theme?: "light" | "dark";
    notifications?: boolean;
    [key: string]: unknown;
  };
}

// User response interface
export interface UserResponse {
  success: boolean;
  data?: User;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

// User state interface for frontend
export interface UserState {
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
