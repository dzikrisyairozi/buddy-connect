import React from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../store/userSlice';
import { RootState, AppDispatch } from '../../store/store';

interface UpdateButtonProps {
  userId?: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
}

const UpdateButton: React.FC<UpdateButtonProps> = ({
  userId = 'me',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.user);

  const handleFetchUser = () => {
    dispatch(fetchUserData(userId));
  };

  return (
    <Box>
      <Button
        variant={variant}
        color={color}
        size={size}
        onClick={handleFetchUser}
        disabled={status === 'loading'}
        startIcon={status === 'loading' ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {status === 'loading' ? 'Loading...' : 'Fetch User Data'}
      </Button>
      
      {status === 'succeeded' && (
        <Typography color="success.main" sx={{ mt: 1 }}>
          User data fetched successfully!
        </Typography>
      )}
      
      {status === 'failed' && (
        <Typography color="error" sx={{ mt: 1 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default UpdateButton; 