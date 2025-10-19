"use client";

import { useDisclosure } from "@heroui/react";
import { SetupSidebar, MobileMenuButton } from "./SetupSidebar";
import { Breadcrumbs } from "../Breadcrumbs";
import { Footer } from "../Shared/Footer";

interface SetupLayoutProps {
  user: any;
  children: React.ReactNode;
}

export const SetupLayout = ({ user, children }: SetupLayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Sidebar - Desktop fixed, Mobile drawer */}
      <SetupSidebar
        user={user}
        className="fixed hidden md:flex"
        isOpen={isOpen}
        onClose={onClose}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:ml-96 w-full">
        <Breadcrumbs startContent={<MobileMenuButton onOpen={onOpen} />} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
