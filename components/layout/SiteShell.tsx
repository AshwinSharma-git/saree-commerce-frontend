"use client";

import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toast } from "./Toast";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-32">{children}</main>
      <Footer />
      <Toast />
      <WhatsAppFab />
    </>
  );
}
