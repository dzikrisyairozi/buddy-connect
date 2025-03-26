"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import FirebaseAuthListener from "./FirebaseAuthListener";
import { StoreProvider } from "../store/StoreProvider";
import { CacheProvider } from "@emotion/react";
import { AnimatePresence } from "framer-motion";
import createEmotionCache from "../utils/createEmotionCache";
import theme from "../theme";
import "./globals.css";
import { Toaster } from "../components/ui/Toaster";

// Client-side cache, shared for the whole session of the user
const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <title>Buddy Connect</title>
        <meta name="description" content="Connect with your buddies" />
      </head>
      <body suppressHydrationWarning>
        <CacheProvider value={clientSideEmotionCache}>
          <StoreProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <FirebaseAuthListener>
                <Toaster />
                <AnimatePresence mode="wait">{children}</AnimatePresence>
              </FirebaseAuthListener>
            </ThemeProvider>
          </StoreProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
