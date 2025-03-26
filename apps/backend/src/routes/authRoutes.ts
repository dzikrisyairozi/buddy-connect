import express, { Router } from "express";
import { registerUser, deleteUser } from "../controllers/auth";
import { authMiddleware } from "../middlewares/authMiddleware";

const router: Router = express.Router();

// Public auth routes
router.post("/register", registerUser);

// Protected auth routes (require authentication)
router.delete("/users/me", authMiddleware, deleteUser);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
