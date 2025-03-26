"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../store/userSlice";
import { RootState, AppDispatch } from "../../store/store";

interface UpdateButtonProps {
  userId?: string;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  size?: "small" | "medium" | "large";
  startIcon?: ReactNode;
  label?: string;
  showSuccessMessage?: boolean;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({
  userId,
  variant = "contained",
  color = "primary",
  size = "medium",
  startIcon,
  label = "Fetch User Data",
  showSuccessMessage = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.user);
  const { currentUser: authUser } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFetchUser = () => {
    // If a specific userId is provided, use it
    // Otherwise default to the current authenticated user's ID
    if (userId) {
      dispatch(fetchUserData(userId));
    } else if (authUser && authUser.uid) {
      dispatch(fetchUserData(authUser.uid));
    } else {
      console.error("No user ID available for fetch");
    }
  };

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return null;
  }

  return (
    <Box>
      <Button
        variant={variant}
        color={color}
        size={size}
        onClick={handleFetchUser}
        disabled={status === "loading"}
        startIcon={
          status === "loading" ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            startIcon
          )
        }
      >
        {status === "loading" ? "Loading..." : label}
      </Button>

      {showSuccessMessage && status === "succeeded" && (
        <Typography color="success.main" sx={{ mt: 1 }}>
          User data fetched successfully!
        </Typography>
      )}

      {status === "failed" && error && (
        <Typography color="error" sx={{ mt: 1 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default UpdateButton;
