import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebaseConfig";

/**
 * Interface for extending Express Request
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    [key: string]: any;
  };
}

/**
 * Middleware to validate Firebase authentication token
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token format",
      });
    }

    try {
      // Verify the token with Firebase Auth
      const decodedToken = await auth.verifyIdToken(token);

      // Attach the user information to the request
      // Extract uid and email, then spread the rest of the token properties
      const { uid, email, ...rest } = decodedToken;
      req.user = {
        uid,
        email: email || "",
        ...rest,
      };

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};

/**
 * Simple middleware for checking authentication
 * This is a simpler version that could be used for development or testing
 */
export const simpleAuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  // Check if API key is provided and valid (this is just an example)
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid API key",
    });
  }

  // Mock user for testing purposes
  req.user = {
    uid: "test-user-id",
    email: "test@example.com",
  };

  next();
};
