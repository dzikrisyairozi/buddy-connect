"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Link as MuiLink,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { status, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? "" : "Please enter a valid email address");
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? "" : "Password must be at least 6 characters");
    return isValid;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ): boolean => {
    const isValid = password === confirmPassword;
    setConfirmPasswordError(isValid ? "" : "Passwords do not match");
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
      password,
      confirmPassword,
    );

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    dispatch(
      registerUser({
        email,
        password,
        displayName: displayName.trim() || undefined,
      }),
    );
  };

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return null;
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh", padding: 2 }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          sx={{
            padding: isMobile ? 2 : 4,
            borderRadius: 2,
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Create Account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              error={!!emailError}
              helperText={emailError}
              disabled={status === "loading"}
              required
            />

            <TextField
              label="Display Name"
              type="text"
              fullWidth
              margin="normal"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={status === "loading"}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validatePassword(password)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={status === "loading"}
              required
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => validateConfirmPassword(password, confirmPassword)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              disabled={status === "loading"}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={status === "loading"}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {status === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Already have an account?
                <Link href="/login" passHref>
                  <MuiLink component="span" sx={{ ml: 1, cursor: "pointer" }}>
                    Sign In
                  </MuiLink>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
