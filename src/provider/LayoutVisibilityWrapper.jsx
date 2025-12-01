"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
// import Hero from "@/components/shared/hero/Hero";
import Footer from "@/components/footer/Footer";

const HIDDEN_ROUTES = [
  "/sign-up",
  "/sign-in",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/verify-otp",
  "/dashboard",
  "/signinaspage",
  "/forget-otp",
  "/forget-password",
  "/account/profile",
  "/account/change-password",
  "/account/booking-history",
  "/account/tour-history",
  "/userprofile",
  "/blog/blogcreate",
];

const LayoutVisibilityWrapper = ({ children }) => {
  const pathname = usePathname();
  const shouldHideLayout = HIDDEN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default LayoutVisibilityWrapper;
