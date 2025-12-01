"use client";

import React, { useContext } from "react";
import styles from "./themeToggle.module.css";
import Image from "next/image";
import { ThemeContext } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggle } = useContext(ThemeContext);
  
  return (
    <div className={styles.container} onClick={toggle}>
      <Image src="/moon.png" alt="theme-toggle" width={16} height={16} />
      <div
        className={styles.circle}
        style={
          theme === "dark"
            ? { left: "1px", right: "auto", background: "#222" }
            : { right: "1px", left: "auto", background: "#fff" }
        }
      ></div>
      <Image src="/sun.png" alt="theme-toggle" width={16} height={16} />
    </div>
  );
};

export default ThemeToggle;
