"use client";
import React, { useState } from "react";
import { CasaBoardLogo } from "../Logo";
import { getPublicLinks, NavLink } from "./NavLinks";
import Link from "next/link";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 max-w-7xl mx-auto">
        <div className="px-0 mx-auto bg-theme-background/80 backdrop-blur-md rounded-b-xl border-theme-border/20">
          <div className="flex items-center h-14 sm:px-4 px-2 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 w-full justify-between">
              <div className="min-w-0 flex items-center gap-2">
                <CasaBoardLogo size="small" />
                <span className="text-theme-text font-bold">CasaBoard</span>
              </div>
              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center gap-2">
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
              {/* Mobile Menu Button */}
              <Button
                isIconOnly
                variant="light"
                className="sm:hidden text-theme-text"
                onPress={() => setIsDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Icon path={mdiMenu} className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        placement="right"
        backdrop="blur"
        className="sm:hidden"
      >
        <DrawerContent className="bg-theme-background text-theme-text border-l border-theme-border">
          <DrawerHeader className="border-b border-theme-border flex flex-col items-center gap-2 py-6">
            <CasaBoardLogo size="small" />
            <span className="text-theme-text font-bold text-lg">CasaBoard</span>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-2 py-4">
            {getPublicLinks().map((link: NavLink) => (
              <Button
                key={link.href}
                as={Link}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                variant="light"
                className="justify-start text-theme-text"
                startContent={link.icon}
                onPress={() => setIsDrawerOpen(false)}
              >
                {link.label}
              </Button>
            ))}
          </DrawerBody>
          <DrawerFooter className="border-t border-theme-border flex flex-col items-center gap-2 py-4">
            <div className="text-xs text-theme-text-secondary text-center">
              <a
                href="mailto:support@casaboard.dev"
                className="text-theme-primary hover:underline"
              >
                support@casaboard.dev
              </a>
            </div>
            <div className="text-xs text-theme-text-secondary text-center">
              © {new Date().getFullYear()} CasaBoard. All rights reserved.
            </div>
            <div className="text-xs text-theme-text-secondary text-center">
              Powered by{" "}
              <a
                href="https://element-software.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-primary hover:underline"
              >
                Element Software
              </a>{" "}
              and{" "}
              <a
                href="https://element-connect.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-primary hover:underline"
              >
                Element Connect
              </a>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
