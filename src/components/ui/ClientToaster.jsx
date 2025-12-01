"use client";

import { Toaster } from "@/components/ui/Toaster";

export default function ClientToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={5000}
      visibleToasts={3}
      offset={16}
    />
  );
}
