"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

// mounting the session provider to the root of the app, so that all components have access to it.
const AuthProvider = ({ children }: any) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
