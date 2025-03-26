"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  IconButton,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Edit, RefreshCw, MapPin, Phone, Settings, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchUserData } from "../../store/userSlice";
import UpdateButton from "../molecules/UpdateButton";
import EditProfileForm from "../molecules/EditProfileForm";

const UserProfile: React.FC = () => {
  const { currentUser, status, error } = useSelector(
    (state: RootState) => state.user,
  );
  const { currentUser: authUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isMounted, setIsMounted] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log("UserProfile mounted", {
      isAuthenticated,
      authUser,
      currentUser,
    });
  }, []);

  // Log when the component renders with user data
  useEffect(() => {
    if (currentUser) {
      console.log("Current user data available:", {
        id: currentUser.id,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      });
    }
  }, [currentUser]);

  // Fetch user data if authenticated but profile data is missing
  useEffect(() => {
    if (
      isAuthenticated &&
      authUser &&
      (!currentUser || Object.keys(currentUser).length === 0)
    ) {
      console.log("Fetching user data for:", authUser.uid);
      dispatch(fetchUserData(authUser.uid));
    }
  }, [isAuthenticated, authUser, currentUser, dispatch]);

  // Force fetch on manual trigger for debugging
  const handleForceRefresh = () => {
    if (authUser) {
      console.log("Force refreshing user data for:", authUser.uid);
      dispatch(fetchUserData(authUser.uid));
    }
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  // Prevent hydration errors by only rendering on the client side
  if (!isMounted) {
    return (
      <Box
        sx={{
          padding: 3,
          maxWidth: 600,
          margin: "auto",
          mt: 4,
          textAlign: "center",
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Initializing...
        </Typography>
      </Box>
    );
  }

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Debug info
  if (debugMode) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          maxWidth: 800,
          margin: "auto",
          mt: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Debug Information
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleDebugMode}
            sx={{ mr: 2 }}
          >
            Exit Debug Mode
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleForceRefresh}
          >
            Force Refresh
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
          Authentication Status
        </Typography>
        <Typography>
          Is Authenticated: {isAuthenticated ? "Yes" : "No"}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Auth User
        </Typography>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(authUser, null, 2)}
        </pre>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          User Data Status
        </Typography>
        <Typography>Status: {status}</Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Current User Data
        </Typography>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(currentUser, null, 2)}
        </pre>
      </Paper>
    );
  }

  // Show loading state
  if (status === "loading") {
    return (
      <Box
        sx={{
          padding: 3,
          maxWidth: 600,
          margin: "auto",
          mt: 4,
          textAlign: "center",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading profile data...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (status === "failed" && error) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          maxWidth: 600,
          margin: "auto",
          mt: 4,
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={handleForceRefresh}>
            Try Again
          </Button>
          <Button variant="text" color="secondary" onClick={toggleDebugMode}>
            Debug
          </Button>
        </Box>
      </Paper>
    );
  }

  // If no user data is available
  if (!currentUser || Object.keys(currentUser).length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          maxWidth: 600,
          margin: "auto",
          mt: 4,
        }}
      >
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No user data available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isAuthenticated
              ? "We couldn't load your profile information."
              : "Please log in to view your profile."}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            {authUser && (
              <UpdateButton userId={authUser.uid} label="Refresh Data" />
            )}
            <Button variant="text" color="secondary" onClick={toggleDebugMode}>
              Debug
            </Button>
          </Stack>
        </Box>
      </Paper>
    );
  }

  // Get the display name and photo URL safely
  const displayName = currentUser.displayName || "Anonymous User";
  const photoURL =
    !avatarError && currentUser.photoURL ? currentUser.photoURL : undefined;
  const firstInitial = displayName.charAt(0).toUpperCase();

  // Let's create a directly rendered user profile without complex nesting
  if (currentUser && isMounted && status === "succeeded") {
    console.log("Rendering profile with data:", currentUser.displayName);

    // Simple direct render for testing
    return (
      <Box sx={{ maxWidth: 800, margin: "auto", mt: 4, px: 2 }}>
        <Button
          variant="text"
          color="secondary"
          onClick={toggleDebugMode}
          sx={{ alignSelf: "flex-end", mb: 2 }}
        >
          Debug
        </Button>

        <Card elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            sx={{
              height: 120,
              background: theme.palette.primary.main,
              position: "relative",
            }}
          >
            {/* Edit button positioned at top-right corner */}
            <IconButton
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 1)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
                zIndex: 2,
              }}
              onClick={handleOpenEditDialog}
              color="primary"
            >
              <Edit size={20} />
            </IconButton>
          </Box>

          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: -8,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid white",
                  bgcolor: "primary.main",
                  fontSize: "2.5rem",
                }}
              >
                {!photoURL ? (
                  firstInitial
                ) : (
                  <img
                    src={photoURL}
                    alt={displayName}
                    onError={handleAvatarError}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Avatar>

              <Typography variant="h4" sx={{ mt: 2 }}>
                {displayName}
              </Typography>

              <Typography variant="body1" color="text.secondary">
                {currentUser.email}
              </Typography>

              <Divider sx={{ width: "100%", my: 3 }} />

              {/* Minimal user details */}
              <Grid container spacing={3}>
                {currentUser.bio && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle1">Bio</Typography>
                      <Typography variant="body2">{currentUser.bio}</Typography>
                    </Box>
                  </Grid>
                )}

                {currentUser.location && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle1">Location</Typography>
                      <Typography variant="body2">
                        {currentUser.location}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {currentUser.phoneNumber && (
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle1">Phone</Typography>
                      <Typography variant="body2">
                        {currentUser.phoneNumber}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Preferences */}
              {currentUser.preferences && (
                <Box sx={{ width: "100%", mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Preferences
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {currentUser.preferences?.theme && (
                      <Chip
                        label={`Theme: ${currentUser.preferences.theme}`}
                        color={
                          currentUser.preferences.theme === "dark"
                            ? "default"
                            : "primary"
                        }
                        variant="outlined"
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    )}
                    {currentUser.preferences?.notifications !== undefined && (
                      <Chip
                        label={`Notifications: ${currentUser.preferences.notifications ? "On" : "Off"}`}
                        color={
                          currentUser.preferences.notifications
                            ? "success"
                            : "default"
                        }
                        variant="outlined"
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}

              {/* Update button */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshCw size={18} />}
                onClick={handleForceRefresh}
                sx={{ mt: 3 }}
              >
                Refresh Data
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <EditProfileForm
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "auto",
        mt: 4,
        px: 2,
      }}
    >
      {/* Debug button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          variant="text"
          size="small"
          color="secondary"
          onClick={toggleDebugMode}
          sx={{ fontSize: "0.75rem" }}
        >
          Debug
        </Button>
      </Box>

      {/* Main profile card */}
      <Card
        elevation={6}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          mb: 3,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* Background header */}
        <Box
          sx={{
            height: 120,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
            position: "relative",
          }}
        />

        {/* Edit button positioned at top-right corner */}
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 1)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease",
            zIndex: 2,
          }}
          onClick={handleOpenEditDialog}
          color="primary"
        >
          <Edit size={20} />
        </IconButton>

        <CardContent sx={{ position: "relative", pt: 0 }}>
          {/* Avatar */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: -50 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                border: "4px solid white",
                bgcolor: "primary.main",
                fontSize: "2.5rem",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {!photoURL ? (
                firstInitial
              ) : (
                <img
                  src={photoURL}
                  alt={displayName}
                  onError={handleAvatarError}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Avatar>
          </Box>

          {/* User information */}
          <Box
            sx={{
              textAlign: "center",
              mt: 2,
              mb: 3,
            }}
          >
            <Typography variant="h4" gutterBottom>
              {displayName}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {currentUser?.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* User details in a grid */}
          <Grid container spacing={3}>
            {currentUser?.bio && (
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <User size={20} color={theme.palette.text.secondary} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Bio
                    </Typography>
                    <Typography variant="body1">{currentUser.bio}</Typography>
                  </Box>
                </Stack>
              </Grid>
            )}

            {currentUser?.location && (
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <MapPin size={20} color={theme.palette.text.secondary} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {currentUser.location}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            )}

            {currentUser?.phoneNumber && (
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Phone size={20} color={theme.palette.text.secondary} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {currentUser.phoneNumber}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            )}
          </Grid>

          {currentUser?.preferences && (
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <Settings size={20} color={theme.palette.text.secondary} />
                <Typography variant="subtitle2" color="text.secondary">
                  Preferences
                </Typography>
              </Stack>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {currentUser.preferences?.theme && (
                  <Chip
                    label={`Theme: ${currentUser.preferences.theme}`}
                    color={
                      currentUser.preferences.theme === "dark"
                        ? "default"
                        : "primary"
                    }
                    variant="outlined"
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                )}
                {currentUser.preferences?.notifications !== undefined && (
                  <Chip
                    label={`Notifications: ${currentUser.preferences.notifications ? "On" : "Off"}`}
                    color={
                      currentUser.preferences.notifications
                        ? "success"
                        : "default"
                    }
                    variant="outlined"
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 5,
              mb: 2,
            }}
          >
            <UpdateButton
              userId={currentUser?.id}
              size="medium"
              startIcon={<RefreshCw size={18} />}
              label="Refresh Data"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <EditProfileForm open={editDialogOpen} onClose={handleCloseEditDialog} />
    </Box>
  );
};

export default UserProfile;
