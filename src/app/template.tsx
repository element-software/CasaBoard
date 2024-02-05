"use client";
import "./globals.css";
import { HassConnect } from "@hakit/core";
import React from "react";
import Sidebar from "@/components/Sidebar";

const HASS_URL = "https://ha.iqbalibrahim.co.uk";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <HassConnect hassUrl={HASS_URL}>
      <Sidebar>{children}</Sidebar>
    </HassConnect>
  );
}
