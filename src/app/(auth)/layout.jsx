"use client";

import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Sidebar from "../components/sidebar";
import MainContent from "../components/mainContent";

export default function AuthenticatedLayout({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const pathname = usePathname();

  const publicRoutes = ["/login", "/register"];
  const shouldShowSidebar = isAuthenticated && !publicRoutes.includes(pathname);

  return (
    <>
      {shouldShowSidebar ? (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-1/2">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </>
  );
}
