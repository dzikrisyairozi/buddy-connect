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
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";

const MotionPaper = motion(Paper);
const MotionTextField = motion(TextField);
const MotionButton = motion(Button);
const MotionTypography = motion(Typography);

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface LoginFormProps {
  isRegisterMode?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isRegisterMode = false }) => {
  const [isLogin, setIsLogin] = useState(!isRegisterMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        padding: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
      }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <MotionPaper
          elevation={6}
          sx={{
            padding: isMobile ? 3 : 4,
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <MotionTypography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3 }}
              variants={itemVariants}
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </MotionTypography>

            {error && (
              <motion.div variants={itemVariants}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <MotionTextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateEmail(email)}
              error={!!emailError}
              helperText={emailError}
              disabled={status === "loading"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} />
                  </InputAdornment>
                ),
              }}
              variants={itemVariants}
            />

            {!isLogin && (
              <MotionTextField
                label="Display Name"
                type="text"
                fullWidth
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={status === "loading"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserRound size={18} />
                    </InputAdornment>
                  ),
                }}
                variants={itemVariants}
              />
            )}

            <MotionTextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => validatePassword(password)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={status === "loading"}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variants={itemVariants}
            />

            {!isLogin && (
              <MotionTextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() =>
                  validateConfirmPassword(password, confirmPassword)
                }
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                disabled={status === "loading"}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variants={itemVariants}
              />
            )}

            <MotionButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={status === "loading"}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </MotionButton>

            <Box sx={{ position: "relative", my: 2 }}>
              <Divider sx={{ my: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 1 }}
                >
                  OR
                </Typography>
              </Divider>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <motion.div variants={itemVariants}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </Typography>
                <MotionButton
                  onClick={toggleAuthMode}
                  color="secondary"
                  variant="text"
                  sx={{ mt: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </MotionButton>
              </motion.div>
            </Box>
          </Box>
        </MotionPaper>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
