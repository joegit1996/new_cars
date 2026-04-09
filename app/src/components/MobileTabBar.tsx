"use client";

import { Home, Search, Scale, Heart, User } from "lucide-react";
import { useIsEmbedded } from "../hooks/useIsEmbedded";

interface MobileTabBarProps {
  activeTab?: "home" | "search" | "compare" | "saved" | "account";
  compareCount?: number;
}

const tabs = [
  { id: "home" as const, label: "Home", icon: Home, href: "/" },
  { id: "search" as const, label: "Search", icon: Search, href: "/search" },
  { id: "compare" as const, label: "Compare", icon: Scale, href: "/compare" },
  { id: "saved" as const, label: "Saved", icon: Heart, href: "/saved" },
  { id: "account" as const, label: "Account", icon: User, href: "/account" },
];

export default function MobileTabBar({
  activeTab = "home",
  compareCount = 0,
}: MobileTabBarProps) {
  const isEmbedded = useIsEmbedded();
  if (isEmbedded) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#E2E8F0] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <a
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-[#1A56DB]" : "text-[#64748B]"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {tab.id === "compare" && compareCount > 0 && (
                  <span className="absolute -top-1.5 -end-2 min-w-[16px] h-[16px] flex items-center justify-center bg-[#1A56DB] text-white text-[9px] font-bold rounded-full px-0.5">
                    {compareCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] leading-tight ${
                  isActive ? "font-bold" : "font-regular"
                }`}
              >
                {tab.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
