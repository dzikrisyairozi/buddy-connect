import { db } from '../config/firebaseConfig';
import { User, CreateUserRequest, UpdateUserRequest } from '../entities/user';

const COLLECTION_NAME = 'USERS';
const usersCollection = db.collection(COLLECTION_NAME);

/**
 * Repository for interacting with the USERS collection in Firestore
 */
export class UserRepository {
  /**
   * Get user by ID
   * @param userId User ID
   * @returns User data or null if not found
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await usersCollection.doc(userId).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   * @param email User email
   * @returns User data or null if not found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param userData User data to create
   * @param customId Optional custom ID for the document
   * @returns Created user data
   */
  async createUser(userData: CreateUserRequest, customId?: string): Promise<User> {
    try {
      const now = new Date();
      
      const newUser = {
        ...userData,
        createdAt: now,
        updatedAt: now
      };
      
      let docRef;
      
      if (customId) {
        // Use the provided custom ID
        await usersCollection.doc(customId).set(newUser);
        docRef = usersCollection.doc(customId);
      } else {
        // Let Firestore generate an auto ID
        docRef = await usersCollection.add(newUser);
      }
      
      const newDoc = await docRef.get();
      
      return {
        id: newDoc.id,
        ...newDoc.data()
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update existing user
   * @param userId User ID
   * @param userData User data to update
   * @returns Updated user data
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const now = new Date();
      
      const updateData = {
        ...userData,
        updatedAt: now
      };
      
      await usersCollection.doc(userId).update(updateData);
      
      const updatedUserDoc = await usersCollection.doc(userId).get();
      
      return {
        id: updatedUserDoc.id,
        ...updatedUserDoc.data()
      } as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param userId User ID
   * @returns Boolean indicating success
   */
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await usersCollection.doc(userId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get all users
   * @param limit Limit number of users (default 100)
   * @returns Array of users
   */
  async getAllUsers(limit = 100): Promise<User[]> {
    try {
      const snapshot = await usersCollection.limit(limit).get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
} 