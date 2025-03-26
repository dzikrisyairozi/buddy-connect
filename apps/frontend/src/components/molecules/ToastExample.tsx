"use client";

import React from "react";
import { toast } from "sonner";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function ToastExample() {
  // Test different types of toast notifications
  const showSuccessToast = () => {
    toast.success("This is a success toast notification");
    console.log("Success toast triggered");
  };

  const showErrorToast = () => {
    toast.error("This is an error toast notification");
    console.log("Error toast triggered");
  };

  const showInfoToast = () => {
    toast("This is a default toast notification");
    console.log("Info toast triggered");
  };

  const showPromiseToast = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(resolve, 2000);
      }),
      {
        loading: "Loading...",
        success: "Promise resolved successfully!",
        error: "Promise failed!",
      },
    );
    console.log("Promise toast triggered");
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
        Click the buttons below to test different types of toast notifications
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" color="success" onClick={showSuccessToast}>
          Success Toast
        </Button>
        <Button variant="contained" color="error" onClick={showErrorToast}>
          Error Toast
        </Button>
        <Button variant="contained" color="primary" onClick={showInfoToast}>
          Info Toast
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={showPromiseToast}
        >
          Promise Toast
        </Button>
      </Stack>
    </Box>
  );
}
