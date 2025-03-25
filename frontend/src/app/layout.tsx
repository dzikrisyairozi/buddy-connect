'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';
import theme from '../theme';
import { Providers } from '../store/Providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {isMounted ? (
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          ) : (
            <div style={{ visibility: 'hidden' }}>{children}</div>
          )}
        </Providers>
      </body>
    </html>
  );
}
