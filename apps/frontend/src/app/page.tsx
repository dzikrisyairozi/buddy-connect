"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CircularProgress, Box, Typography } from "@mui/material";
import Navbar from "../components/organisms/Navbar";

const HomeContent = () => {
  const router = useRouter();
  const { isAuthenticated, status } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    // First check if we're still loading authentication state
    if (status !== "loading") {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, router, status]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Buddy Connect
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Redirecting you to the appropriate page...
        </Typography>
        <CircularProgress size={60} />
      </Box>
    </Box>
  );
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading spinner until component is mounted
  if (!isMounted) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // After mounted, render the HomeContent component
  return <HomeContent />;
}
