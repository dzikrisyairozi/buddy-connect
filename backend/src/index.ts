import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import app from './core/app';

// Import the test function
import { helloWorld } from './functions';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const region = 'asia-southeast2';

// Get allowed origins from environment or use a wildcard
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['*'];

console.log(`[CONFIG] Allowed origins: ${JSON.stringify(allowedOrigins)}`);

// Export the Express app as a Firebase Function with the specific region
export const api = functions
  .region(region)
  .runWith({ 
    timeoutSeconds: 60,
    memory: '256MB',
  })
  .https.onRequest((req, res) => {
    const origin = req.headers.origin || '';
    
    // Set CORS headers for all requests - crucial for Firebase Functions
    res.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.set('Access-Control-Max-Age', '86400'); // 24 hours
    
    // Handle origin (either match against whitelist or allow any in development)
    if (process.env.NODE_ENV === 'development' || allowedOrigins.includes('*')) {
      res.set('Access-Control-Allow-Origin', '*');
    } else if (origin && allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight OPTIONS requests directly
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    
    // Log all requests
    console.log(`[FUNCTION] ${req.method} ${req.url} from origin: ${origin}`);
    
    // For non-OPTIONS requests, use the Express app
    return app(req, res);
  });

// Re-export the test function
export { helloWorld }; 