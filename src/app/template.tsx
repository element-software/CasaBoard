"use client";
import { Inter } from 'next/font/google'
import './globals.css'
import { HassConnect } from '@hakit/core'
import { ThemeProvider } from '@hakit/components'
import React from 'react';

const inter = Inter({ subsets: ['latin'] })

const HASS_URL = 'http://192.168.1.222:8123';

export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <HassConnect hassUrl={HASS_URL}>
        <ThemeProvider />
        {children}
      </HassConnect>
  )
}
