// "use client";

// import Link from 'next/link';
// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { usePathname } from 'next/navigation'; // For active link detection
// import { logout } from '../redux/slices/authSlice';
// import {
//   LayoutDashboard,
//   LogOut,
//   Settings,
//   User,
//   Users,
//   Menu,
//   X,
//   ChevronsDown,
// } from 'lucide-react';
// import { useSidebar } from '../context/sidebarContext';

// export default function Sidebar() {
//   const dispatch = useDispatch();
//   const pathname = usePathname(); // Get the current route
//   const { isCollapsed, setIsCollapsed } = useSidebar(); // Use the context
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Handle window resize to determine mobile view
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     window.location.href = '/login';
//   };

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   // Determine if a link is active
//   const isActive = (href) => {
//     return pathname === href;
//   };

//   return (
//     <>
//       {/* Hamburger Menu for Mobile */}
//       <div className="md:hidden fixed top-0 left-0 w-full bg-[#13162D] text-[#FAF4F4] p-4 flex justify-between items-center z-50">
//         <div className="flex items-center">
//           <Image
//             src="/images/IcareLogo.png"
//             alt="iCare Logo"
//             width={40}
//             height={40}
//             className="mr-2"
//           />
//           {/* <span className="text-xl font-bold">EQUILINK</span> */}
//         </div>
//         <button onClick={toggleMobileMenu}>
//           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-screen bg-white text-[#FAF4F4] shadow-md transition-all duration-300 z-40 ${
//           isMobile
//             ? isMobileMenuOpen
//               ? 'w-56 translate-x-0'
//               : 'w-0 -translate-x-full'
//             : isCollapsed
//             ? 'w-14'
//             : 'w-56'
//         } ${isMobile ? 'pt-16' : ''}`}
//       >
//         {/* Logo Section */}
//         <div className="p-4 flex items-center justify-between border-b border-gray-500">
//           {!isCollapsed && !isMobile && (
//             <Image
//               src="/images/IcareLogo.png"
//               alt="ICare Logo"
//               width={isCollapsed ? 40 : 100} // Adjusted for smaller sidebar width
//               height={isCollapsed ? 40 : 40}
//               className="transition-all duration-300"
//             />
//           )}
//           {!isMobile && (
//             <button
//               onClick={toggleSidebar}
//               className="p-2 hover:bg-[#FDBF17] hover:text-[#13162D] rounded"
//             >
//               {isCollapsed ? <Menu size={20} /> : <ChevronsDown size={20} />}
//             </button>
//           )}
//         </div>

//         {/* Navigation Links */}
//         <nav className="mt-4 flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
//           {/* Top Links */}
//           <div>
//             <Link href="/">
//               <div
//                 className={`flex items-center p-4 hover:bg-[#FDBF17] hover:text-[#13162D] ${
//                   isActive('/') ? 'bg-[#FDBF17] text-[#13162D]' : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <LayoutDashboard size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'Dashboard'}
//               </div>
//             </Link>
//             <Link href="/users">
//               <div
//                 className={`flex items-center p-4 hover:bg-[#FDBF17] hover:text-[#13162D] ${
//                   isActive('/users') ? 'bg-[#FDBF17] text-[#13162D]' : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <Users size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'Users'}
//               </div>
//             </Link>
//             <Link href="/profile">
//               <div
//                 className={`flex items-center p-4 hover:bg-[#FDBF17] hover:text-[#13162D] ${
//                   isActive('/profile') ? 'bg-[#FDBF17] text-[#13162D]' : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <User size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'My Profile'}
//               </div>
//             </Link>
//           </div>

//           {/* Bottom Links (Settings and Logout) */}
//           <div className="mt-auto">
//             <Link href="/settings">
//               <div
//                 className={`flex items-center p-4 hover:bg-[#FDBF17] hover:text-[#13162D] ${
//                   isActive('/settings') ? 'bg-[#FDBF17] text-[#13162D]' : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <Settings size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'Settings'}
//               </div>
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="flex items-center p-4 hover:bg-[#FDBF17] hover:text-[#13162D] w-full text-left mb-[4rem]"
//             >
//               <span className="mr-2">
//                 <LogOut size={20} />
//               </span>
//               {!isCollapsed && !isMobile && 'Logout'}
//             </button>
//           </div>
//         </nav>
//       </aside>

//       {/* Overlay for Mobile Menu */}
//       {isMobile && isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={toggleMobileMenu}
//         />
//       )}
//     </>
//   );
// }

// SECOND TRY
// "use client";

// import Link from 'next/link';
// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { usePathname } from 'next/navigation'; // For active link detection
// import { logout } from '../redux/slices/authSlice';
// import {
//   LayoutDashboard,
//   LogOut,
//   Settings,
//   User,
//   Users,
//   Menu,
//   X,
//   ChevronsDown,
// } from 'lucide-react';
// import { useSidebar } from '../context/sidebarContext';

// export default function Sidebar() {
//   const dispatch = useDispatch();
//   const pathname = usePathname(); 
//   const { isCollapsed, setIsCollapsed } = useSidebar(); 
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Handle window resize to determine mobile view
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     window.location.href = '/login';
//   };

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   // Determine if a link is active
//   const isActive = (href) => {
//     return pathname === href;
//   };

//   return (
//     <>
//       {/* Hamburger Menu for Mobile */}
//       <div className="md:hidden fixed top-0 left-0 w-full bg-white text-[#11453B] p-4 flex justify-between items-center z-50 border-b border-gray-200">
//         <div className="flex items-center">
//           <Image
//             src="/images/icare.png"
//             alt="iCare Logo"
//             width={40}
//             height={40}
//             className="mr-2"
//           />
//         </div>
//         <button onClick={toggleMobileMenu}>
//           {isMobileMenuOpen ? <X size={24} className="text-[#11453B]" /> : <Menu size={24} className="text-white" />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-screen bg-[#11453B] text-white shadow-md transition-all duration-300 z-40 ${
//           isMobile
//             ? isMobileMenuOpen
//               ? 'w-56 translate-x-0'
//               : 'w-0 -translate-x-full'
//             : isCollapsed
//             ? 'w-14'
//             : 'w-56'
//         } ${isMobile ? 'pt-16' : ''}`}
//       >
//         {/* Logo Section */}
//         <div className="p-4 flex items-center justify-between border-b border-gray-200">
//           {!isCollapsed && !isMobile && (
//             <Image
//               src="/images/icare.png"
//               alt="ICare Logo"
//               width={isCollapsed ? 40 : 100}
//               height={isCollapsed ? 40 : 40}
//               className="transition-all duration-300"
//             />
//           )}
//           {!isMobile && (
//             <button
//               onClick={toggleSidebar}
//               className="p-2 hover:bg-[#F0F7EB80] rounded text-white"
//             >
//               {isCollapsed ? <Menu size={20} /> : <ChevronsDown size={20} />}
//             </button>
//           )}
//         </div>

//         {/* Navigation Links */}
//         <nav className="mt-4 flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
//           {/* Top Links */}
//           <div>
//             <Link href="/">
//               <div
//                 className={`flex items-center p-4 mb-3 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
//                   isActive('/') 
//                     ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium' 
//                     : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <LayoutDashboard size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'Dashboard'}
//               </div>
//             </Link>
//             <Link href="/users">
//               <div
//                 className={`flex items-center p-4 mb-3 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
//                   isActive('/users') 
//                     ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium' 
//                     : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <Users size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'Users'}
//               </div>
//             </Link>
//             <Link href="/profile">
//               <div
//                 className={`flex items-center p-4 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
//                   isActive('/profile') 
//                     ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium' 
//                     : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <User size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'My Profile'}
//               </div>
//             </Link>
//           </div>

//           {/* Bottom Links (Settings and Logout) */}
//           <div className="mt-auto">
//             <Link href="/settings">
//               <div
//                 className={`flex items-center p-4 mb-3 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
//                   isActive('/settings') 
//                     ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium' 
//                     : ''
//                 }`}
//               >
//                 <span className="mr-2">
//                   <Settings size={20} />
//                 </span>
//                 {!isCollapsed && !isMobile && 'Settings'}
//               </div>
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="flex items-center p-4 hover:bg-[#F0F7EB80] hover:text-[#11453B] w-full text-left mb-[2rem] text-white"
//             >
//               <span className="mr-2">
//                 <LogOut size={20} />
//               </span>
//               {!isCollapsed && !isMobile && 'Logout'}
//             </button>
//           </div>
//         </nav>
//       </aside>

//       {/* Overlay for Mobile Menu */}
//       {isMobile && isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={toggleMobileMenu}
//         />
//       )}
//     </>
//   );
// }


// THIRD TRY
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { logout } from '../redux/slices/authSlice';
import {
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  Menu,
  X,
  ChevronsDown,
} from 'lucide-react';
import { useSidebar } from '../context/sidebarContext';

export default function Sidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#11453B] text-white shadow-md transition-all duration-300 z-40 ${
          isMobile
            ? isMobileMenuOpen
              ? 'w-56 translate-x-0'
              : 'w-0 -translate-x-full'
            : isCollapsed
            ? 'w-14'
            : 'w-56'
        } ${isMobile ? 'pt-16' : ''}`}
      >
        {/* Logo Section */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {!isCollapsed && !isMobile && (
            <Image
              src="/images/icare.png"
              alt="ICare Logo"
              width={isCollapsed ? 40 : 100}
              height={isCollapsed ? 40 : 40}
              className="transition-all duration-300"
            />
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-[#F0F7EB80] rounded text-white"
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronsDown size={20} />}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
          {/* Top Links */}
          <div>
            <Link href="/">
              <div
                className={`flex items-center p-3 mb-2 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
                  isActive('/')
                    ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium'
                    : ''
                }`}
              >
                <span className="mr-2">
                  <LayoutDashboard size={20} />
                </span>
                {!isCollapsed && !isMobile && 'Dashboard'}
              </div>
            </Link>
            <Link href="/users">
              <div
                className={`flex items-center p-3 mb-2 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
                  isActive('/users')
                    ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium'
                    : ''
                }`}
              >
                <span className="mr-2">
                  <Users size={20} />
                </span>
                {!isCollapsed && !isMobile && 'Users'}
              </div>
            </Link>
            <Link href="/profile">
              <div
                className={`flex items-center p-3 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
                  isActive('/profile')
                    ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium'
                    : ''
                }`}
              >
                <span className="mr-2">
                  <User size={20} />
                </span>
                {!isCollapsed && !isMobile && 'My Profile'}
              </div>
            </Link>
          </div>

          {/* Bottom Links (Settings and Logout) */}
          <div className="mt-auto">
            <Link href="/settings">
              <div
                className={`flex items-center p-3 mb-2 hover:bg-[#F0F7EB80] hover:text-[#11453B] ${
                  isActive('/settings')
                    ? 'bg-[#F0F7EB80] border-l-[5px] border-red-700 rounded-sm text-[#11453B] font-medium'
                    : ''
                }`}
              >
                <span className="mr-2">
                  <Settings size={20} />
                </span>
                {!isCollapsed && !isMobile && 'Settings'}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center p-3 hover:bg-[#F0F7EB80] hover:text-[#11453B] w-full text-left mb-[5rem] text-white"
            >
              <span className="mr-2">
                <LogOut size={20} />
              </span>
              {!isCollapsed && !isMobile && 'Logout'}
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}