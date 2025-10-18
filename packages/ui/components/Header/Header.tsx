"use client";
import React from "react";
import { CasaBoardLogo } from "../Logo";
import { getPublicLinks, NavLink } from "./NavLinks";
import Link from "next/link";
import { Button } from "@heroui/react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 max-w-7xl mx-auto">
      <div className="px-0 mx-auto bg-theme-background/80 backdrop-blur-md rounded-b-xl border-theme-border/20">
        <div className="flex items-center h-14 sm:px-4 px-2 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 w-full justify-between">
            <div className="min-w-0 flex items-center gap-2">
              <CasaBoardLogo size="small" />
              <span className="text-theme-text font-bold">CasaBoard</span>
            </div>
            <div className="flex items-center gap-2">
              {getPublicLinks().map((link: NavLink) => (
                <Button
                  key={link.href}
                  as={Link}
                  href={link.href}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  variant="bordered"
                  color="primary"
                  className="justify-center text-theme-text"
                  startContent={link.icon}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
