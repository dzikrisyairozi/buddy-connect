import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserData, updateUserData } from '../apis/user';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    [key: string]: unknown;
  };
}

export interface UserState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await getUserData(userId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch user data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }: { userId: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await updateUserData(userId, userData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update user data';
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user data
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update user data
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 