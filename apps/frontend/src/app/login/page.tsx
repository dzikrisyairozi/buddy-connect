'use client';

import React, { useState, useEffect } from 'react';
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
  Link as MuiLink
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { status, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  };

  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? '' : 'Password must be at least 6 characters');
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    dispatch(loginUser({ email, password }));
  };

  return (
    <Grid 
      container 
      justifyContent="center" 
      alignItems="center" 
      sx={{ minHeight: '100vh', padding: 2 }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper 
          elevation={3} 
          sx={{ 
            padding: isMobile ? 2 : 4,
            borderRadius: 2
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Sign In
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
              disabled={status === 'loading'}
              required
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
              disabled={status === 'loading'}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={status === 'loading'}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {status === 'loading' ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don&apos;t have an account?
                <Link href="/register" passHref>
                  <MuiLink component="span" sx={{ ml: 1, cursor: 'pointer' }}>
                    Sign Up
                  </MuiLink>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return null;
  }

  return <LoginContent />;
} 