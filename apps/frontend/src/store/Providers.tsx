"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import FirebaseAuthListener from "../app/FirebaseAuthListener";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <FirebaseAuthListener>{children}</FirebaseAuthListener>
    </Provider>
  );
}
