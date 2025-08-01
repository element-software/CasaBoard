import type { Metadata } from 'next'
import './globals.css'
import React from 'react';
import { Kanit } from 'next/font/google';
import classNames from 'classnames';
import { ThemeProvider } from '@/components/ThemeSwitch';

export const metadata: Metadata = {
  title: 'Smart Home Dashboard',
  description: 'Created by Element Connect',
}
const kanit = Kanit({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display:'swap',
  fallback: ['Arial', 'sans-serif'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-full bg-theme-background'>
      <body className={classNames("h-full bg-theme-background text-theme-text", kanit.className)}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
