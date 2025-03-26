"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box,
  Container,
  useTheme,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Settings,
  UserPlus,
  AlertCircle,
  Menu as MenuIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logoutUser, deleteAccount } from "../../store/authSlice";
import { fetchUserData } from "../../store/userSlice";
import Link from "next/link";

const MotionIconButton = motion(IconButton);
const MotionAvatar = motion(Avatar);
const MotionButton = motion(Button);
const MotionContainer = motion.div;

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = "Buddy Connect" }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser: authUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const { currentUser: profileUser } = useSelector(
    (state: RootState) => state.user,
  );
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const mobileMenuOpen = Boolean(mobileMenuAnchorEl);

  // Combine user data from auth and profile, prioritizing profile data
  const displayName =
    profileUser?.displayName || authUser?.displayName || "User";
  const email = profileUser?.email || authUser?.email || "";
  const photoURL = profileUser?.photoURL || authUser?.photoURL || undefined;

  // Fetch user data if authenticated but profile data is missing
  useEffect(() => {
    if (isAuthenticated && authUser && !profileUser) {
      dispatch(fetchUserData(authUser.uid));
    }
  }, [isAuthenticated, authUser, profileUser, dispatch]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    handleMobileMenuClose();
    await dispatch(logoutUser());
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      handleClose();
      handleMobileMenuClose();
      await dispatch(deleteAccount());
      router.push("/login");
    }
  };

  const handleProfile = () => {
    handleClose();
    handleMobileMenuClose();
    router.push("/dashboard");
  };

  // Prepare menu items for authenticated users
  const authenticatedMobileMenuItems = [
    <MenuItem key="user-info" sx={{ py: 1.5 }}>
      <Avatar
        alt={displayName}
        src={photoURL}
        sx={{ width: 24, height: 24, mr: 1.5 }}
      >
        {displayName.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="body1">{email}</Typography>
    </MenuItem>,
    <Divider key="divider-1" />,
    <MenuItem key="profile" onClick={handleProfile} sx={{ py: 1.5 }}>
      <ListItemIcon>
        <User size={18} />
      </ListItemIcon>
      Profile
    </MenuItem>,
    <Divider key="divider-2" />,
    <MenuItem key="logout" onClick={handleLogout} sx={{ py: 1.5 }}>
      <ListItemIcon>
        <LogOut size={18} />
      </ListItemIcon>
      Sign Out
    </MenuItem>,
    <MenuItem
      key="delete-account"
      onClick={handleDeleteAccount}
      sx={{ color: "error.main", py: 1.5 }}
    >
      <ListItemIcon>
        <AlertCircle size={18} color="red" />
      </ListItemIcon>
      Delete Account
    </MenuItem>,
  ];

  // Prepare menu items for non-authenticated users
  const unauthenticatedMobileMenuItems = [
    <MenuItem key="signin" component={Link} href="/login" sx={{ py: 1.5 }}>
      Sign In
    </MenuItem>,
    <MenuItem key="register" component={Link} href="/register" sx={{ py: 1.5 }}>
      Register
    </MenuItem>,
  ];

  // Prepare desktop menu items
  const desktopMenuItems = [
    <MenuItem key="profile" onClick={handleProfile}>
      <ListItemIcon>
        <User size={18} />
      </ListItemIcon>
      Profile
    </MenuItem>,
    <Divider key="divider" />,
    <MenuItem key="logout" onClick={handleLogout}>
      <ListItemIcon>
        <LogOut size={18} />
      </ListItemIcon>
      Sign Out
    </MenuItem>,
    <MenuItem
      key="delete-account"
      onClick={handleDeleteAccount}
      sx={{ color: "error.main" }}
    >
      <ListItemIcon>
        <AlertCircle size={18} color="red" />
      </ListItemIcon>
      Delete Account
    </MenuItem>,
  ];

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{ px: { xs: 1, sm: 2 }, py: 1, justifyContent: "space-between" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h5"
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              {title}
            </Typography>
          </motion.div>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <MotionIconButton
              color="inherit"
              onClick={handleMobileMenu}
              whileTap={{ scale: 0.9 }}
            >
              <MenuIcon />
            </MotionIconButton>

            <Menu
              id="mobile-menu"
              anchorEl={mobileMenuAnchorEl}
              keepMounted
              open={mobileMenuOpen}
              onClose={handleMobileMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 200, mt: 1.5 },
              }}
            >
              {isAuthenticated
                ? authenticatedMobileMenuItems
                : unauthenticatedMobileMenuItems}
            </Menu>
          </Box>

          {/* Desktop menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {isAuthenticated ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
                >
                  {email}
                </Typography>

                <MotionIconButton
                  onClick={handleMenu}
                  color="inherit"
                  size="small"
                  aria-controls={open ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  sx={{ ml: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MotionAvatar
                    alt={displayName}
                    src={photoURL}
                    sx={{ width: 36, height: 36 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </MotionAvatar>
                </MotionIconButton>

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      minWidth: 200,
                      borderRadius: 2,
                      mt: 1,
                      "& .MuiMenuItem-root": {
                        py: 1.5,
                      },
                    },
                  }}
                >
                  {desktopMenuItems}
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <MotionContainer
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    color="inherit"
                    component={Link}
                    href="/login"
                    variant="text"
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.2),
                      },
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    Sign In
                  </Button>
                </MotionContainer>

                <MotionContainer
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    href="/register"
                    startIcon={<UserPlus size={16} />}
                    sx={{ px: 2, py: 1, height: "100%", width: "100%" }}
                  >
                    Register
                  </Button>
                </MotionContainer>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
