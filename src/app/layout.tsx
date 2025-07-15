'use client';

import './globals.css'; // must be imported at the top
import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/lib/theme';
import Link from 'next/link';
import styled from '@/lib/styled-components';

const NavBar = styled.nav`
  background: white;
  padding: 10px 20px;
  display: flex;
  gap: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
`;

const PageWrapper = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <NavBar>
            <Link href="/">Home</Link>
            <Link href="/test">Test</Link>
            <Link href="/results">Results</Link>
          </NavBar>
          <PageWrapper>{children}</PageWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}