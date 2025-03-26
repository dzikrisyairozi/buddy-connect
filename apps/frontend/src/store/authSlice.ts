import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase/config";
import {
  registerUser as apiRegisterUser,
  deleteUser as apiDeleteUser,
} from "../apis/user";
import { toast } from "sonner";
import { clearUser } from "./userSlice";

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
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
};

// Helper function to extract serializable fields from Firebase User
const extractSerializableUser = (
  user: FirebaseUser | null,
): SerializableUser | null => {
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
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      toast.success(
        `Welcome back, ${userCredential.user.displayName || userCredential.user.email}!`,
      );
      return extractSerializableUser(userCredential.user);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid email or password";
      toast.error(`Login failed: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      email,
      password,
      displayName = "",
    }: { email: string; password: string; displayName?: string },
    { rejectWithValue },
  ) => {
    try {
      // Use our backend API to register the user - this creates both Firebase Auth and Firestore records
      const response = await apiRegisterUser(email, password, displayName);

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }

      // Log in the user after successful registration
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      toast.success("Account created successfully! Welcome to Buddy Connect.");
      return extractSerializableUser(userCredential.user);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to register";
      toast.error(`Registration failed: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      toast.success("Logged out successfully");
      return null;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to log out";
      toast.error(`Logout failed: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // First delete the user via our API endpoint (handles both Firestore and Firebase Auth)
      await apiDeleteUser();

      // Then sign out locally
      await signOut(auth);

      dispatch(clearUser());
      toast.success("Account deleted successfully");
      return null;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete account";
      toast.error(`Account deletion failed: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      state.currentUser = extractSerializableUser(action.payload);
      state.isAuthenticated = action.payload !== null;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = "idle";
        state.currentUser = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
