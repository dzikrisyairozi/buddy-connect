'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid,
  Divider,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import UpdateButton from '../molecules/UpdateButton';

const UserProfile: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentUser: authUser } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return null;
  }

  if (!currentUser) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          borderRadius: 2,
          maxWidth: 600,
          margin: 'auto',
          mt: 4
        }}
      >
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No user data available
          </Typography>
          {authUser && (
            <Box sx={{ mt: 2 }}>
              <UpdateButton />
            </Box>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: isMobile ? 2 : 3, 
        borderRadius: 2,
        maxWidth: 600,
        margin: 'auto',
        mt: 4
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Avatar
            src={currentUser.photoURL || undefined}
            alt={currentUser.displayName || 'User'}
            sx={{ 
              width: 120, 
              height: 120, 
              margin: 'auto',
              bgcolor: 'primary.main',
              fontSize: '3rem',
              mb: 2
            }}
          >
            {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          
          <Typography variant="h4" gutterBottom>
            {currentUser.displayName || 'Anonymous User'}
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            {currentUser.email}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Divider />
        </Grid>
        
        {currentUser.bio && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Bio
            </Typography>
            <Typography variant="body1">
              {currentUser.bio}
            </Typography>
          </Grid>
        )}
        
        {currentUser.location && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body1">
              {currentUser.location}
            </Typography>
          </Grid>
        )}
        
        {currentUser.phoneNumber && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Phone
            </Typography>
            <Typography variant="body1">
              {currentUser.phoneNumber}
            </Typography>
          </Grid>
        )}
        
        {currentUser.preferences && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentUser.preferences?.theme && (
                <Chip 
                  label={`Theme: ${currentUser.preferences.theme}`}
                  color={currentUser.preferences.theme === 'dark' ? 'default' : 'primary'}
                  variant="outlined"
                />
              )}
              {currentUser.preferences?.notifications !== undefined && (
                <Chip 
                  label={`Notifications: ${currentUser.preferences.notifications ? 'On' : 'Off'}`}
                  color={currentUser.preferences.notifications ? 'success' : 'default'}
                  variant="outlined"
                />
              )}
            </Box>
          </Grid>
        )}
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <UpdateButton userId={currentUser.id} size="large" />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfile; 