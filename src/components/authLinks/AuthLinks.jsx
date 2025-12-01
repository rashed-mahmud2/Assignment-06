"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // import context
import styles from "./authlinks.module.css";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);
  const {status, logout} = useAuth(); // get auth state & logout
  const router = useRouter();

  // Logout handler (frontend + optional backend)
  const handleLogout = async () => {
    try {
      // Optional backend logout API
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      logout(); // updates frontend auth state instantly
      router.push("/sign-in"); // SPA-friendly redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (status === "loading") {
    return <span className={styles.link}>Checking...</span>;
  }

  return (
    <>
      {/* Desktop Links */}
      {status === "authenticated" ? (
        <>
          <Link className={styles.link} href="/create-blog">
            Create-Blog
          </Link>
          <span className={styles.link} onClick={handleLogout}>
            Logout
          </span>
        </>
      ) : (
        <Link className={styles.link} href="/sign-in">
          Sign In
        </Link>
      )}

      {/* Hamburger Menu */}
      <div className={styles.hambarger} onClick={() => setOpen(!open)}>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>

      {/* Responsive Menu */}
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>

          {status === "authenticated" ? (
            <>
              <Link href="/create-blog">Create-Blog</Link>
              <span className={styles.reslinks} onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : (
            <Link href="/sign-in">Sign In</Link>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
