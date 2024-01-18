import type { Metadata } from 'next'
import './globals.css'
import React from 'react';

export const metadata: Metadata = {
  title: 'InnerSpace Dashboard',
  description: 'Created by Element Connect',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-full bg-white'>
      <body className='h-full'>{children}</body>
    </html>
  )
}
