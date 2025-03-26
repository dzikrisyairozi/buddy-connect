"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { LogOut, User, Settings, UserPlus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logoutUser, deleteAccount } from "../../store/authSlice";
import Link from "next/link";

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = "Buddy Connect" }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
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
      await dispatch(deleteAccount());
      router.push("/login");
    }
  };

  const handleProfile = () => {
    handleClose();
    router.push("/profile");
  };

  const handleSettings = () => {
    handleClose();
    router.push("/settings");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {isAuthenticated ? (
          <>
            <Typography
              variant="body1"
              sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
            >
              {currentUser?.email}
            </Typography>

            <IconButton
              onClick={handleMenu}
              color="inherit"
              size="small"
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{ ml: 1 }}
            >
              <Avatar
                alt={currentUser?.displayName || "User"}
                src={currentUser?.photoURL || undefined}
                sx={{ width: 32, height: 32 }}
              >
                {currentUser?.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : "U"}
              </Avatar>
            </IconButton>

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
                sx: { minWidth: 180 },
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <User size={18} />
                </ListItemIcon>
                Profile
              </MenuItem>

              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>
                Settings
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut size={18} />
                </ListItemIcon>
                Sign Out
              </MenuItem>

              <MenuItem
                onClick={handleDeleteAccount}
                sx={{ color: "error.main" }}
              >
                <ListItemIcon>
                  <AlertCircle size={18} color="red" />
                </ListItemIcon>
                Delete Account
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Button
              color="inherit"
              component={Link}
              href="/login"
              sx={{ mr: 1 }}
            >
              Sign In
            </Button>

            <Button
              variant="contained"
              color="secondary"
              component={Link}
              href="/register"
              startIcon={<UserPlus size={16} />}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
