/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Test script to verify connection to Firebase Function emulators
 * Run with: npm run test:emulator
 */

// Set environment variables for emulator use
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_USE_EMULATOR = 'true';

// Load necessary packages
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Check if backend has firebase-tools installed
const backendPath = path.resolve(__dirname, '../../backend');
const localFirebaseBin = path.resolve(backendPath, 'node_modules/.bin/firebase');

if (!fs.existsSync(localFirebaseBin)) {
  console.error('\n❌ firebase-tools not found in backend/node_modules!');
  console.error('Please install it by running: cd ../backend && npm install --save-dev firebase-tools\n');
  process.exit(1);
}

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configure API endpoint
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'buddy-connect';
const region = 'asia-southeast2'; // Jakarta
const emulatorBaseUrl = `http://localhost:5001/${projectId}/${region}`;
const apiUrl = `${emulatorBaseUrl}/api`;
const helloUrl = `${emulatorBaseUrl}/hello`;

console.log('\n🧪 Testing connection to Firebase Functions emulator...');
console.log(`🔗 Emulator Base URL: ${emulatorBaseUrl}\n`);

// Make test request to the health check endpoint
const testEmulatorConnection = async () => {
  try {
    // Test API health endpoint first
    console.log('📡 Testing api/health endpoint...');
    try {
      const healthResponse = await axios.get(`${apiUrl}/health`);
      console.log(`✅ Health check successful! Status: ${healthResponse.status}`);
      console.log(`Response: ${JSON.stringify(healthResponse.data, null, 2)}\n`);
      
      // Successfully connected to the API function
      console.log('✅ API function is working correctly!');
    } catch (apiError) {
      console.log(`❌ API function test failed: ${apiError.message}`);
      
      // Try the hello function as a fallback
      console.log('\n📡 Testing hello function as fallback...');
      try {
        const helloResponse = await axios.get(helloUrl);
        console.log(`✅ hello function works! Status: ${helloResponse.status}`);
        console.log(`Response: ${JSON.stringify(helloResponse.data, null, 2)}\n`);
        
        console.log('⚠️ Your hello function works, but the main API function is not available.');
        console.log('This suggests an issue with loading your Express app in Firebase Functions.');
      } catch (helloError) {
        console.error('❌ All function tests failed!');
        console.error(`hello error: ${helloError.message}`);
        
        if (helloError.response) {
          console.error(`Status: ${helloError.response.status}`);
          console.error(`Data: ${JSON.stringify(helloError.response.data, null, 2)}`);
        }
        
        console.error('\n🔍 Debug suggestions:');
        console.error('1. Check Firebase Emulator logs for errors');
        console.error('2. Verify your index.ts is exporting functions correctly');
        console.error('3. Make sure firebase.json points to the correct source directory');
        console.error('4. Restart the emulator and try again');
        
        process.exit(1);
      }
    }
    
    // Optionally test a protected endpoint
    console.log('⚠️ Note: API endpoints requiring authentication will fail without a valid token.');
    console.log('👉 Use the web app with emulator mode enabled to test authenticated endpoints.\n');
    
    console.log('✅ Emulator connection test complete!');
    console.log('🚀 You can now run the frontend with:');
    console.log('   npm run dev:emulator\n');
    
  } catch (error) {
    console.error('❌ Error connecting to Firebase Functions emulator:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the emulator.');
      console.error('Make sure the Firebase emulators are running:');
      console.error('  cd ../backend && npm run build && npm run emulators');
    } else {
      // Something happened in setting up the request
      console.error(`Error: ${error.message}`);
    }
    
    process.exit(1);
  }
};

testEmulatorConnection(); 