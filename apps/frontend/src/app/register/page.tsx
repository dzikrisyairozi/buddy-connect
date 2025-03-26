"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useRouter } from "next/navigation";
import LoginForm from "../../components/organisms/LoginForm";

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const RegisterPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return null;
  }

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Pass isRegisterMode prop to LoginForm */}
      <LoginForm isRegisterMode={true} />
    </Box>
  );
};

export default RegisterPage;
