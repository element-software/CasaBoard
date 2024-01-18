"use client";
import { Inter } from 'next/font/google'
import './globals.css'
import { HassConnect } from '@hakit/core'
import { ThemeProvider } from '@hakit/components'
import React from 'react';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] })

const HASS_URL = 'https://ha.iqbalibrahim.co.uk';

export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <HassConnect hassUrl={HASS_URL}>
        <ThemeProvider includeThemeControls={true}/>
          <Sidebar>
            {children}
          </Sidebar>
      </HassConnect>
  )
}
