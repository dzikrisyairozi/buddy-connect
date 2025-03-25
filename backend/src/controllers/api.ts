import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repository/userCollection';
import { UpdateUserRequest, UserResponse } from '../entities/user';

// Initialize the user repository
const userRepository = new UserRepository();

/**
 * Controller for fetching user data from Firestore
 */
export const fetchUserData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      } as UserResponse);
      return;
    }

    const userId = req.params.id || req.user.uid;
    
    // Fetch user data from Firestore
    const userData = await userRepository.getUserById(userId);
    
    if (!userData) {
      res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      } as UserResponse);
      return;
    }
    
    // Return user data
    res.status(200).json({
      success: true,
      data: userData,
      message: 'User data fetched successfully'
    } as UserResponse);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as UserResponse);
  }
};

/**
 * Controller for updating user data in Firestore
 */
export const updateUserData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.uid) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      } as UserResponse);
      return;
    }
    
    const userId = req.params.id || req.user.uid;
    const updateData: UpdateUserRequest = req.body;
    
    // Check if user exists
    const existingUser = await userRepository.getUserById(userId);
    
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      } as UserResponse);
      return;
    }
    
    // Update user data
    const updatedUser = await userRepository.updateUser(userId, updateData);
    
    // Return updated user data
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User data updated successfully'
    } as UserResponse);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user data',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as UserResponse);
  }
}; 