import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Define a serializable user type
export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  isAnonymous: boolean;
}

export interface AuthState {
  currentUser: SerializableUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
};

// Helper function to extract serializable fields from Firebase User
const extractSerializableUser = (user: FirebaseUser | null): SerializableUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    isAnonymous: user.isAnonymous,
  };
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return extractSerializableUser(userCredential.user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to login';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      return extractSerializableUser(userCredential.user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to register';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to logout';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      state.currentUser = extractSerializableUser(action.payload);
      state.isAuthenticated = action.payload !== null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer; 