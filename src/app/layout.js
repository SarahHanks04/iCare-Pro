import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./components/reduxProvider";
import { SidebarProvider } from "./context/sidebarContext";
import AuthenticatedLayout from "./(auth)/layout";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "iCarePro | Dashboard",
  description: "User Management Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <SidebarProvider>
            <AuthenticatedLayout>
              {children}
              <Toaster position="top-right" />
            </AuthenticatedLayout>
          </SidebarProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
