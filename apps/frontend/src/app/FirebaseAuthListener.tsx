"use client";

import { useEffect, ReactNode } from "react";
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

  useEffect(() => {
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
  }, [dispatch]);

  return <>{children}</>;
}
