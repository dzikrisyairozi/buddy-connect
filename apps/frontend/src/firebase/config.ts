"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Declare default empty instances that will be initialized on the client side
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase only on the client side
if (typeof window !== "undefined") {
  try {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    // Initialize Firebase if it hasn't been initialized already
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);

      // Initialize Firebase services
      auth = getAuth(app);
      db = getFirestore(app);

      // Connect to emulators for local development
      const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATOR === "true";
      if (useEmulator) {
        console.log("Using Firebase emulators");
        connectAuthEmulator(auth, "http://localhost:9099", {
          disableWarnings: true,
        });
        connectFirestoreEmulator(db, "localhost", 8080);
      }

      // Initialize Analytics only on client side
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const analytics = getAnalytics(app);
      } catch (error) {
        // Analytics might not be available in all environments
        console.log("Analytics not initialized:", error);
      }
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  // Create empty stubs for server-side rendering
  // These will be replaced with real instances on the client
  app = {} as FirebaseApp;
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
  } as unknown as Auth;
  db = {} as Firestore;
}

export { app, auth, db };
