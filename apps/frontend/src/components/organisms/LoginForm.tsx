import React, { useState } from "react";
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";

const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    if (!isLogin) {
      const isConfirmPasswordValid = validateConfirmPassword(
        password,
        confirmPassword,
      );
      if (!isConfirmPasswordValid) {
        return;
      }

      dispatch(
        registerUser({
          email,
          password,
          displayName: displayName.trim() || undefined,
        }),
      );
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

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
              {isLogin ? "Sign In" : "Create Account"}
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

            {!isLogin && (
              <TextField
                label="Display Name"
                type="text"
                fullWidth
                margin="normal"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={status === "loading"}
              />
            )}

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

            {!isLogin && (
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  validateConfirmPassword(password, confirmPassword)
                }
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                disabled={status === "loading"}
                required
              />
            )}

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
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button onClick={toggleAuthMode} color="primary" sx={{ ml: 1 }}>
                  {isLogin ? "Sign Up" : "Sign In"}
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
