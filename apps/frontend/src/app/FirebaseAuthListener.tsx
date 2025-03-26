"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { setUser } from "../store/authSlice";
import { fetchUserData } from "../store/userSlice";
import { AppDispatch } from "../store/store";

export default function FirebaseAuthListener() {
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

  return null;
}
