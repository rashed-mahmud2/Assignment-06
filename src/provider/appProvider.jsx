"use client";

import React from "react";
import { ThemeContextProvider } from "@/context/ThemeContext";
import TanstackProvider from "@/provider/tanstackProvider";

const AppProviders = ({ children }) => {
  return (
    <TanstackProvider>
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </TanstackProvider>
  );
};

export default AppProviders;
