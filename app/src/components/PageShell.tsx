"use client";

import { Suspense, type ReactNode } from "react";
import { useEmbed, EmbedProvider } from "../context/EmbedContext";
import { CompareProvider } from "../context/CompareContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";

interface PageShellProps {
  children: ReactNode;
  activeTab?: "home" | "search" | "compare" | "saved" | "account";
  compareCount?: number;
}

function ShellContent({ children, activeTab, compareCount = 0 }: PageShellProps) {
  const { isEmbedded } = useEmbed();

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8FAFC] ${
        isEmbedded
          ? "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          : ""
      }`}
    >
      {!isEmbedded && <Navbar compareCount={compareCount} />}
      {children}
      {!isEmbedded && <Footer />}
      {!isEmbedded && <MobileTabBar activeTab={activeTab} compareCount={compareCount} />}
    </div>
  );
}

export default function PageShell({ children, activeTab, compareCount }: PageShellProps) {
  return (
    <CompareProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
        <EmbedProvider>
          <ShellContent activeTab={activeTab} compareCount={compareCount}>
            {children}
          </ShellContent>
        </EmbedProvider>
      </Suspense>
    </CompareProvider>
  );
}
