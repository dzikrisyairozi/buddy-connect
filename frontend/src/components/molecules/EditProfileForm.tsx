'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateUser } from '../../store/userSlice';

interface EditProfileFormProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, status, error } = useSelector((state: RootState) => state.user);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [previewURL, setPreviewURL] = useState('');

  // Load current user data when dialog opens
  useEffect(() => {
    if (open && currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
      setPreviewURL(currentUser.photoURL || '');
    }
  }, [open, currentUser]);

  const handlePhotoURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPhotoURL(url);
    if (url && url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
      setPreviewURL(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const userData = {
      displayName: displayName.trim() || undefined,
      photoURL: photoURL.trim() || undefined
    };
    
    dispatch(updateUser({ 
      userId: currentUser.id, 
      userData 
    })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        onClose();
      }
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={status !== 'loading' ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Edit Profile</Typography>
        <IconButton onClick={onClose} disabled={status === 'loading'}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          {status === 'succeeded' && (
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              Profile updated successfully!
            </Alert>
          )}
          
          <Avatar
            src={previewURL || undefined}
            alt={displayName || 'User'}
            sx={{ 
              width: 100, 
              height: 100, 
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2.5rem'
            }}
          >
            {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          
          <TextField
            label="Display Name"
            fullWidth
            margin="normal"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={status === 'loading'}
          />
          
          <TextField
            label="Photo URL"
            fullWidth
            margin="normal"
            value={photoURL}
            onChange={handlePhotoURLChange}
            disabled={status === 'loading'}
            placeholder="https://example.com/photo.jpg"
            helperText="Enter a valid image URL (jpg, png, gif, webp)"
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          disabled={status === 'loading'}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={status === 'loading'}
          startIcon={status === 'loading' ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {status === 'loading' ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileForm; 