import React from "react";
import styles from "./input.module.css";

function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`${styles.input} ${className}`}
      {...props}
    />
  );
}

export { Input };
