import type { Metadata } from 'next'
import './globals.css'
import React from 'react';
import { Kanit } from 'next/font/google';

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
    <html lang="en" className='h-full bg-neutral-900'>
      <body className={`h-full ${kanit.className}`}>{children}</body>
    </html>
  )
}
