import type { Metadata } from 'next'
import './globals.css'
import React from 'react';
import { Montserrat } from 'next/font/google';

export const metadata: Metadata = {
  title: 'InnerSpace Dashboard',
  description: 'Created by Element Connect',
}
const montserrat = Montserrat({
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
    <html lang="en" className='h-full bg-white'>
      <body className={`h-full ${montserrat.className}`}>{children}</body>
    </html>
  )
}
