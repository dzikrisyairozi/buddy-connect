import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { UserRepository } from "../repository/userCollection";
import {
  UpdateUserRequest,
  UserResponse,
  CreateUserRequest,
} from "../entities/user";

// Initialize the user repository
const userRepository = new UserRepository();

/**
 * Controller for fetching user data from Firestore
 */
export const fetchUserData = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      } as UserResponse);
      return;
    }

    const userId = req.params.id || req.user.uid;

    // Fetch user data from Firestore
    let userData = await userRepository.getUserById(userId);

    // If user doesn't exist in Firestore but exists in Firebase Auth, create it
    if (!userData && userId === req.user.uid) {
      const newUserData: CreateUserRequest = {
        email: req.user.email || "",
        displayName: req.user.name || "",
        photoURL: req.user.picture || "",
      };

      try {
        userData = await userRepository.createUser(newUserData, userId);

        console.log(
          `Created new user document for Firebase Auth user ${userId}`,
        );
      } catch (createError) {
        console.error("Error creating user in Firestore:", createError);
      }
    }

    if (!userData) {
      res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`,
      } as UserResponse);
      return;
    }

    // Return user data
    res.status(200).json({
      success: true,
      data: userData,
      message: "User data fetched successfully",
    } as UserResponse);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      error: error instanceof Error ? error.message : "Unknown error",
    } as UserResponse);
  }
};

/**
 * Controller for updating user data in Firestore
 */
export const updateUserData = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      } as UserResponse);
      return;
    }

    const userId = req.params.id || req.user.uid;
    const updateData: UpdateUserRequest = req.body;

    // Log the update request for debugging
    console.log("Update user request:", {
      userId,
      updateData,
      reqUser: {
        uid: req.user.uid,
        email: req.user.email,
      },
    });

    // Check if user exists
    let existingUser = await userRepository.getUserById(userId);

    // If user doesn't exist in Firestore but exists in Firebase Auth, create it first
    if (!existingUser && userId === req.user.uid) {
      const newUserData: CreateUserRequest = {
        email: req.user.email || "",
        displayName: req.user.name || "",
        photoURL: req.user.picture || "",
      };

      try {
        existingUser = await userRepository.createUser(newUserData, userId);

        console.log(
          `Created new user document for Firebase Auth user ${userId}`,
        );
      } catch (createError) {
        console.error("Error creating user in Firestore:", createError);
      }
    }

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`,
      } as UserResponse);
      return;
    }

    // Handle explicit null/empty values for photoURL
    // If photoURL is undefined in the request but the key is present, set it to null/empty string
    if ("photoURL" in updateData && !updateData.photoURL) {
      updateData.photoURL = "";
    }

    // Allow administrative updates only for admins or the user updating their own data
    if (userId !== req.user.uid && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own account",
      } as UserResponse);
      return;
    }

    // Update user data
    const updatedUser = await userRepository.updateUser(userId, updateData);

    // Return updated user data
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User data updated successfully",
    } as UserResponse);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user data",
      error: error instanceof Error ? error.message : "Unknown error",
    } as UserResponse);
  }
};
