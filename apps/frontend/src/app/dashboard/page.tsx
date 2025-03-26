"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Box, Container } from "@mui/material";
import { RootState } from "../../store/store";
import UserProfile from "../../components/organisms/UserProfile";
import Navbar from "../../components/organisms/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isMounted]);

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <ToastExample /> */}

        <UserProfile />
      </Container>
    </Box>
  );
}
