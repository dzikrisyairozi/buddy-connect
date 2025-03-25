/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to start both frontend and backend emulators
 * Run with: node scripts/start-dev-emulator.js
 * 
 * Important: This script expects your Firebase Functions to be deployed
 * to the asia-southeast2 (Jakarta) region. If your region is different,
 * you'll need to update the region in:
 * - backend/src/index.ts
 * - frontend/src/apis/user.ts
 * - frontend/scripts/test-emulator.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const backendPath = path.resolve(__dirname, '../../backend');
const frontendPath = path.resolve(__dirname, '..');
const localFirebaseBin = path.resolve(backendPath, 'node_modules/.bin/firebase');

// Check if firebase-tools is installed in the backend
if (!fs.existsSync(localFirebaseBin)) {
  console.error('\n❌ firebase-tools not found in backend/node_modules!');
  console.error('Please install it by running: cd ../backend && npm install --save-dev firebase-tools\n');
  process.exit(1);
}

// Function to run a command in a specific directory
const runCommand = (command, args, cwd) => {
  console.log(`Running command "${command} ${args.join(' ')}" in ${cwd}`);
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit'
  });
  
  return proc;
};

// Start backend emulator
console.log('\n🔥 Starting backend Firebase emulators...');
const backendProc = runCommand('npm', ['run', 'build'], backendPath);

// Wait for build to complete before starting emulators
backendProc.on('close', (code) => {
  if (code !== 0) {
    console.error(`Backend build failed with code ${code}`);
    process.exit(code);
  }
  
  console.log('\n🔥 Starting Firebase emulators...');
  const emulatorsProc = runCommand('npm', ['run', 'emulators'], backendPath);
  
  // Listen for emulators process to exit
  emulatorsProc.on('close', (emuCode) => {
    console.log(`Firebase emulators exited with code ${emuCode}`);
    // Kill frontend process if emulators go down
    if (frontendProc && !frontendProc.killed) {
      frontendProc.kill();
    }
    process.exit(emuCode);
  });
});

// Start frontend in emulator mode
console.log('\n🚀 Starting frontend in emulator mode...');
const frontendProc = runCommand('npm', ['run', 'dev:emulator'], frontendPath);

// Listen for frontend process to exit
frontendProc.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Received SIGINT. Shutting down...');
  process.exit(0);
}); 