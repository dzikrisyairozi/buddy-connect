import axios from "axios";
import { auth } from "../firebase/config";
import { User } from "@buddy-connect/shared";

// Set base URL for API calls
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Flag to track if we're using the emulator
let isUsingEmulator = false;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Enable credentials for CORS requests
  withCredentials: false,
});

// Add auth token and handle CORS for requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  // Add auth token if user is logged in
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add additional headers for CORS if in emulator mode
  if (isUsingEmulator) {
    // These headers help with CORS in some cases
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Accept"] = "application/json";
  }

  return config;
});

// Helper function to prefix paths with /api when using emulator
const getPath = (path: string): string => {
  // If using emulator and the path doesn't already start with /api
  if (isUsingEmulator && !path.startsWith("/api")) {
    return `/api${path}`;
  }
  return path;
};

// API Functions
export const getUserData = async (userId: string = "me") => {
  const path = getPath(`/users/${userId}`);
  return api.get<{ success: boolean; data: User; message: string }>(path);
};

export const updateUserData = async (
  userId: string = "me",
  userData: Partial<User>,
) => {
  const path = getPath(`/users/${userId}`);
  return api.put<{ success: boolean; data: User; message: string }>(
    path,
    userData,
  );
};

export const registerUser = async (
  email: string,
  password: string,
  displayName?: string,
  photoURL?: string,
) => {
  const path = getPath("/auth/register");
  return api.post<{ success: boolean; data: User; message: string }>(path, {
    email,
    password,
    displayName,
    photoURL,
  });
};

export const deleteUser = async (userId: string = "me") => {
  const path = getPath(`/auth/users/${userId}`);
  return api.delete<{ success: boolean; message: string }>(path);
};

// For testing with Firebase Emulator
export const configureApiForEmulator = () => {
  // Get project ID from Firebase config
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "buddy-connect-f1215";
  const region = "asia-southeast2"; // Jakarta region

  // Update base URL to point to emulator base URL (without /api)
  const emulatorBaseUrl = `http://localhost:5001/${projectId}/${region}`;

  // Set the flag to indicate we're using the emulator
  isUsingEmulator = true;

  // This is the key change - we're updating the API client to use the emulator base URL
  api.defaults.baseURL = emulatorBaseUrl;

  console.log(
    `API now configured to use Firebase Functions emulator at: ${emulatorBaseUrl}`,
  );
  console.log(
    `Register endpoint will now be at: ${emulatorBaseUrl}/api/auth/register`,
  );

  // Test the connection to the emulator
  const testUrl = `${emulatorBaseUrl}/hello`;
  axios
    .get(testUrl)
    .then((response) => {
      console.log(
        "✅ Connected to Firebase Emulator successfully:",
        response.data,
      );
    })
    .catch((error) => {
      console.warn(
        "⚠️ Could not connect to Firebase Emulator hello function:",
        error.message,
      );
      console.warn(
        "API calls may fail if the Firebase Emulator is not running properly.",
      );
    });

  // For easier debugging - this will show the full URL of each request
  api.interceptors.request.use((request) => {
    if (request.url) {
      // Log the complete URL for easier debugging
      const fullUrl = `${api.defaults.baseURL}${request.url}`;
      console.log(
        `Emulator Request: ${request.method?.toUpperCase()} ${fullUrl}`,
      );
    } else {
      console.log(
        `Emulator Request: ${request.method?.toUpperCase()} ${request.url}`,
      );
    }
    return request;
  });

  api.interceptors.response.use(
    (response) => {
      console.log("Emulator Response:", response.status, response.data);
      return response;
    },
    (error) => {
      console.error("Emulator Error:", error.response?.status || error.message);
      console.error("Request URL was:", error.config?.url);
      return Promise.reject(error);
    },
  );
};

export default api;
