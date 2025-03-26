"use client";

import { useEffect, ReactNode, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { setUser } from "../store/authSlice";
import { fetchUserData } from "../store/userSlice";
import { AppDispatch } from "../store/store";

interface FirebaseAuthListenerProps {
  children: ReactNode;
}

export default function FirebaseAuthListener({
  children,
}: FirebaseAuthListenerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this effect on the client side
    if (typeof window === "undefined" || !isClient) {
      return;
    }

    // Make sure auth is properly initialized
    if (!auth || typeof auth.onAuthStateChanged !== "function") {
      console.warn("Firebase auth not properly initialized");
      return () => {};
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        // Set auth user in state
        dispatch(setUser(user));

        // If user is authenticated, fetch the complete user profile including photoURL
        if (user) {
          dispatch(fetchUserData(user.uid));
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      return () => {};
    }
  }, [dispatch, isClient]);

  return <>{children}</>;
}
