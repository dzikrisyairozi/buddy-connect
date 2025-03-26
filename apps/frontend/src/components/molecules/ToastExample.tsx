"use client";

import React from "react";
import { toast } from "sonner";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  UserCheck,
  LogIn,
  UserPlus,
  RefreshCw,
  LogOut,
  Edit,
} from "lucide-react";

export default function ToastExample() {
  // Simulate toast notifications for various app actions
  const showLoginToast = () => {
    toast.success("Login successful!", {
      description: "Welcome back to Buddy Connect!",
      icon: <LogIn size={18} />,
    });
    console.log("Login toast triggered");
  };

  const showRegisterToast = () => {
    toast.success("Account created successfully!", {
      description: "Welcome to Buddy Connect! Your account has been created.",
      icon: <UserPlus size={18} />,
    });
    console.log("Register toast triggered");
  };

  const showRefreshToast = () => {
    toast.success("Data refreshed successfully!", {
      description: "Your profile data has been updated.",
      icon: <RefreshCw size={18} />,
    });
    console.log("Refresh toast triggered");
  };

  const showEditToast = () => {
    toast.success("Profile updated!", {
      description: "Your profile changes have been saved.",
      icon: <Edit size={18} />,
    });
    console.log("Edit toast triggered");
  };

  const showLogoutToast = () => {
    toast.success("Logged out successfully", {
      description: "You have been securely logged out.",
      icon: <LogOut size={18} />,
    });
    console.log("Logout toast triggered");
  };

  const showErrorToast = () => {
    toast.error("Something went wrong", {
      description: "Please try again or contact support if the issue persists.",
    });
    console.log("Error toast triggered");
  };

  return (
    <Box
      sx={{
        my: 4,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Test Toast Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click the buttons below to test toast notifications for app actions
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        flexWrap="wrap"
        gap={2}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<LogIn size={18} />}
          onClick={showLoginToast}
        >
          Login Toast
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<UserPlus size={18} />}
          onClick={showRegisterToast}
        >
          Register Toast
        </Button>
        <Button
          variant="contained"
          color="info"
          startIcon={<RefreshCw size={18} />}
          onClick={showRefreshToast}
        >
          Refresh Data Toast
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Edit size={18} />}
          onClick={showEditToast}
        >
          Edit Profile Toast
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<LogOut size={18} />}
          onClick={showLogoutToast}
        >
          Logout Toast
        </Button>
        <Button variant="outlined" color="error" onClick={showErrorToast}>
          Error Toast
        </Button>
      </Stack>
    </Box>
  );
}
