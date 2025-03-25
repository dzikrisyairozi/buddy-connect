import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import userRoutes from '../routes/userRoutes';
import authRoutes from '../routes/authRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Buddy Connect API',
    version: '1.0.0'
  });
});

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

export default app; 