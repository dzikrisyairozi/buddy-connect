import app from './app';
import mongoose from 'mongoose';

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buddy-connect';

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    });
}

export default app; 