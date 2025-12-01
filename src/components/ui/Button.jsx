import React from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./button.module.css"; // <-- CSS Module import

function Button({
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button };
