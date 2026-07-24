import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { ViewerApp } from "./ViewerApp";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element");
}

createRoot(root).render(
  <StrictMode>
    <HeroUIProvider>
      <ViewerApp />
    </HeroUIProvider>
  </StrictMode>
);
