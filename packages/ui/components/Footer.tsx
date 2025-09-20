"use client";
import React from "react";
import Link from "next/link";
import { LinkService } from "@repo/lib";
import { CasaBoardLogo } from "./Logo";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-theme-border/40 bg-theme-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <CasaBoardLogo size="small" variant="dark" />
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href={LinkService.crossAppHref("public", "/about")}
              className="text-theme-text-secondary hover:text-theme-primary"
            >
              About
            </Link>
            <span className="opacity-30">•</span>
            <Link
              href="/privacy"
              className="text-theme-text-secondary hover:text-theme-primary"
            >
              Privacy Policy
            </Link>
            <span className="opacity-30">•</span>
            <Link
              href="/cookies"
              className="text-theme-text-secondary hover:text-theme-primary"
            >
              Cookie Policy
            </Link>
            <span className="opacity-30">•</span>
            <a
              href="mailto:support@casaboard.dev"
              className="text-theme-text-secondary hover:text-theme-primary"
            >
              support@casaboard.dev
            </a>
          </nav>
        </div>

        <div className="mt-6 text-xs text-theme-text-secondary text-center">
          © {year} CasaBoard. All rights reserved. Powered by{" "}
          <a
            href="https://element-software.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-primary"
          >
            Element Software
          </a>
        </div>
      </div>
    </footer>
  );
};
