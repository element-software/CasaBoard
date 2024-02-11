"use client";
import "../globals.css";
import { HassConnect } from "@hakit/core";
import React from "react";
import Sidebar from "@/components/Sidebar";

const HASS_URL = "https://ha.iqbalibrahim.co.uk";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <HassConnect hassUrl={HASS_URL}>
      <Sidebar thermostat="climate.central_heating_and_hot_water_tank_heat">{children}</Sidebar>
    </HassConnect>
  );
}
