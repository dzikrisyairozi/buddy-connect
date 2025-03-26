"use client";

import { Box, Container, Typography, Divider } from "@mui/material";
import Navbar from "../../components/organisms/Navbar";
import ToastExample from "../../components/molecules/ToastExample";

export default function ToastPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Toast Example
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <ToastExample />
      </Container>
    </Box>
  );
}
