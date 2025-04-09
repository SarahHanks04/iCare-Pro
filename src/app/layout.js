// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import ReduxProvider from "./components/reduxProvider";
// import { SidebarProvider } from "./context/sidebarContext";
// import Sidebar from "./components/sidebar";
// import MainContent from "./components/mainContent";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Door2day | Dashboard",
//   description: "User Management Dashboard",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {/* <ReduxProvider> <div flex-1 md:pl-64 w-full></div>{children}</ReduxProvider> */}
//         <ReduxProvider>
//           <SidebarProvider>
//             {" "}
//             <div className="flex">
//               <Sidebar />
//               {/* <MainContent>{children}</MainContent> */}
//               <MainContent>
//                 {children}
//               </MainContent>
//             </div>
//           </SidebarProvider>
//         </ReduxProvider>
//       </body>
//     </html>
//   );
// }
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./components/reduxProvider";
import { SidebarProvider } from "./context/sidebarContext";
import AuthenticatedLayout from "./(auth)/layout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Door2day | Dashboard",
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
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </SidebarProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
