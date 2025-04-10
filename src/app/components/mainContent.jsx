"use client";

import { useSidebar } from "../context/sidebarContext";

export default function MainContent({ children }) {
  const { isCollapsed } = useSidebar();
  return (
    <main
      className={`flex-1 w-full transition-all duration-300 ${
        isCollapsed ? "md:pl-14" : "md:pl-56"
      } pt-18 md:pt-0`}
    >
      {children}
    </main>
  );
}
