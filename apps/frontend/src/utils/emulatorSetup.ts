"use client";

import { configureApiForEmulator } from "../apis/user";

/**
 * Configures the application to use Firebase Cloud Functions emulator
 * Call this during initialization phase on development environment
 */
export const setupEmulators = () => {
  const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATOR === "true";

  if (useEmulator && typeof window !== "undefined") {
    console.log("Configuring API to use Firebase Functions emulator");
    configureApiForEmulator();

    // Add a visual indicator to show we're using emulators
    if (process.env.NODE_ENV === "development") {
      const emulatorBadge = document.createElement("div");
      emulatorBadge.style.position = "fixed";
      emulatorBadge.style.bottom = "12px";
      emulatorBadge.style.right = "12px";
      emulatorBadge.style.backgroundColor = "#ff7043";
      emulatorBadge.style.color = "white";
      emulatorBadge.style.padding = "4px 8px";
      emulatorBadge.style.borderRadius = "4px";
      emulatorBadge.style.fontSize = "12px";
      emulatorBadge.style.fontWeight = "bold";
      emulatorBadge.style.zIndex = "9999";
      emulatorBadge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      emulatorBadge.textContent = "EMULATOR MODE";
      document.body.appendChild(emulatorBadge);
    }
  }
};

export default setupEmulators;
