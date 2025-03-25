import * as functions from 'firebase-functions';
import cors from 'cors';

// Create a CORS middleware instance
const corsHandler = cors({ origin: true });

// A simple test function to ensure Firebase is loading functions properly
export const helloWorld = functions.region('asia-southeast2').https.onRequest((req, res) => {
  // Use CORS middleware to handle preflight requests
  return corsHandler(req, res, () => {
    res.status(200).json({ message: 'Hello World!' });
  });
}); 