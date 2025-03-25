import express, { Router } from 'express';
import { fetchUserData, updateUserData } from '../controllers/api';
import { authMiddleware, simpleAuthMiddleware } from '../middlewares/authMiddleware';

const router: Router = express.Router();

/**
 * User routes with authentication middleware
 */

// Fetch user data
// GET /api/users/:id - Get user by ID
// GET /api/users/me - Get current user data
router.get('/me', authMiddleware, fetchUserData);
router.get('/:id', authMiddleware, fetchUserData);

// Update user data
// PUT /api/users/:id - Update user by ID
// PUT /api/users/me - Update current user data
router.put('/me', authMiddleware, updateUserData);
router.put('/:id', authMiddleware, updateUserData);

export default router; 