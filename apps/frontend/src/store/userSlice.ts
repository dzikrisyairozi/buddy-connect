import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserData, updateUserData } from '../apis/user';
import { logoutUser } from './authSlice';
import { User, UserState } from '@buddy-connect/shared';

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
      // Ensure photoURL is handled correctly
      if ('photoURL' in userData && userData.photoURL === undefined) {
        userData.photoURL = '';
      }
      
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
    updateUserField: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        };
      }
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
        
        // Make sure photoURL exists, even as empty string
        const user = action.payload;
        if (user && !('photoURL' in user)) {
          user.photoURL = '';
        }
        
        state.currentUser = user;
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
        
        // Make sure photoURL exists, even as empty string
        const user = action.payload;
        if (user && !('photoURL' in user)) {
          user.photoURL = '';
        }
        
        state.currentUser = user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Clear user state when user logs out
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { setUser, clearUser, updateUserField } = userSlice.actions;
export default userSlice.reducer; 