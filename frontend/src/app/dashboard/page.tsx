'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { RootState } from '../../store/store';
import UserProfile from '../../components/organisms/UserProfile';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { AppDispatch } from '../../store/store';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Buddy Connect
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {currentUser?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <UserProfile />
      </Container>
    </Box>
  );
} 