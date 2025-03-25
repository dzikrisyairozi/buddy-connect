import { Request, Response } from 'express';
import { auth } from '../config/firebaseConfig';
import { UserRepository } from '../repository/userCollection';
import { CreateUserRequest, UserResponse } from '../entities/user';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// Initialize the user repository
const userRepository = new UserRepository();

/**
 * Controller for user registration
 * This creates both a Firebase Auth user and a Firestore user document
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      } as UserResponse);
      return;
    }
    
    try {
      // Check if user already exists in Firestore by email
      const existingUser = await userRepository.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        } as UserResponse);
        return;
      }

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: displayName || '',
      });
      
      // Prepare data for Firestore
      const userData: CreateUserRequest = {
        email,
        displayName: displayName || '',
        // Add additional default user data
        preferences: {
          theme: 'light',
          notifications: true
        }
      };
      
      // Create user document in Firestore using the Firebase Auth UID
      const newUser = await userRepository.createUser(userData, userRecord.uid);
      
      console.log(`User registered successfully: ${userRecord.uid} (${email})`);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User registered successfully'
      } as UserResponse);
    } catch (createError) {
      console.error('Error creating user:', createError);
      
      // Check if the user was created in Firebase Auth but not in Firestore
      if (createError instanceof Error && createError.message.includes('Firestore')) {
        try {
          // Try to find the user by email to get their UID
          const authUser = await auth.getUserByEmail(email);
          
          // Delete the Firebase Auth user to maintain consistency
          await auth.deleteUser(authUser.uid);
          
          console.log(`Deleted Firebase Auth user ${authUser.uid} due to Firestore creation failure`);
        } catch (cleanupError) {
          console.error('Failed to clean up Firebase Auth user after Firestore error:', cleanupError);
        }
      }
      
      res.status(400).json({
        success: false,
        message: createError instanceof Error 
          ? createError.message 
          : 'Failed to create user'
      } as UserResponse);
    }
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as UserResponse);
  }
};

/**
 * Controller for deleting a user
 * This removes a user from both Firebase Auth and Firestore
 */
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      } as UserResponse);
      return;
    }

    const userId = req.params.id || req.user.uid;
    
    // Check if the user exists in Firestore
    const existingUser = await userRepository.getUserById(userId);
    
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found in database`
      } as UserResponse);
      return;
    }
    
    // Only allow users to delete their own account unless they're an admin
    if (userId !== req.user.uid && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own account'
      } as UserResponse);
      return;
    }
    
    try {
      // Delete from Firestore first
      await userRepository.deleteUser(userId);
      
      // Then delete from Firebase Auth
      await auth.deleteUser(userId);
      
      console.log(`User deleted successfully: ${userId}`);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      } as UserResponse);
    } catch (deleteError) {
      console.error('Error deleting user:', deleteError);
      
      res.status(500).json({
        success: false,
        message: deleteError instanceof Error 
          ? deleteError.message 
          : 'Failed to delete user'
      } as UserResponse);
    }
  } catch (error) {
    console.error('Error in delete user controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during user deletion',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as UserResponse);
  }
}; 