"use client";
import clarity from "@microsoft/clarity";

export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export const initClarity = () => {
  if (CLARITY_PROJECT_ID) {
    console.log("Initializing Clarity with project ID:", CLARITY_PROJECT_ID);
    clarity.init(CLARITY_PROJECT_ID);
  }
};

// Generate a unique session ID
export const generateClaritySessionId = (): string => {
  console.log("Generating Clarity session ID");
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID from localStorage
export const getSessionId = (): string => {
  console.log("Getting Clarity session ID from localStorage");
  const stored = localStorage.getItem("clarity_session_id");
  if (stored) {
    console.log("Found Clarity session ID in localStorage:", stored);
    return stored;
  }

  const newSessionId = generateClaritySessionId();
  localStorage.setItem("clarity_session_id", newSessionId);
  console.log("Set Clarity session ID in localStorage:", newSessionId);
  return newSessionId;
};

// Identify user with Clarity
export const identifyClarityUser = (
  userId: string,
  userEmail: string,
  sessionId?: string
) => {
  console.log(
    "Identifying user with Clarity with user ID:",
    userId,
    "and user email:",
    userEmail
  );
  const claritySessionId = sessionId || getSessionId();
  clarity.identify(userId, claritySessionId, "setup", userEmail);
};

// Custom event tracking
export const trackClarityEvent = (eventName: string, data?: any) => {
  console.log("Tracking Clarity event:", eventName);
    clarity.event(eventName);
};

// Set custom tags for user identification
export const setClarityUser = (userId: string, sessionId?: string) => {
  console.log("Setting Clarity user:", userId);
    clarity.setTag("userId", userId);
    if (sessionId) {
    clarity.setTag("sessionId", sessionId);
  }
};
