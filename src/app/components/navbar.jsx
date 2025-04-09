// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../redux/slices/authSlice";
// import { useState } from "react";
// import { User, LogOut } from "lucide-react";

// export default function Navbar() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     dispatch(logout());
//     window.location.href = "/login";
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full md:max-w-[66rem] bg-[#11453B] text-white p-4 flex justify-between items-center z-50 md:ml-52">
//       <div className="text-xl font-bold">iCare-Pro Dashboard</div>
//       <div className="relative">
//         <button
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           className="flex items-center space-x-2 focus:outline-none"
//         >
//           <User size={20} />
//           <span className="hidden md:inline">{user?.email || "User"}</span>
//         </button>
//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white text-[#11453B] rounded-md shadow-lg">
//             <div className="p-2 border-b border-gray-200">
//               <p className="text-sm">{user?.email || "User"}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center w-full p-2 hover:bg-gray-100"
//             >
//               <LogOut size={16} className="mr-2" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// SECOND TRY
// "use client";

// import { useSelector } from "react-redux";
// import { useState } from "react";
// import { User, Bell, Menu, X } from "lucide-react";
// import { useSidebar } from "../context/sidebarContext";
// import Image from "next/image";

// export default function Navbar() {
//   const { user } = useSelector((state) => state.auth);
//   const { isCollapsed, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <nav
//       className={`fixed top-0 left-0 w-full bg-[#11453B] text-white p-4 flex justify-between items-center z-50 transition-all duration-300 ${
//         isCollapsed ? "md:ml-14" : "md:ml-56"
//       }`}
//     >
//       {/* Desktop: Show title, Mobile: Show logo */}
//       <div className="flex items-center">
//         <div className="md:hidden flex items-center">
//           <Image
//             src="/images/icare.png"
//             alt="iCare Logo"
//             width={40}
//             height={40}
//             className="mr-2"
//           />
//         </div>
//         <div className="hidden md:block text-xl font-bold">
//           iCare-Pro Dashboard
//         </div>
//       </div>

//       {/* Desktop: Show user dropdown, Mobile: Show hamburger */}
//       <div className="flex items-center space-x-4">
//         {/* Hamburger menu for mobile */}
//         <button
//           onClick={toggleMobileMenu}
//           className="md:hidden focus:outline-none"
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         {/* User dropdown for desktop */}
//         <div className="hidden md:block relative">
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="flex items-center space-x-2 focus:outline-none"
//           >
//             <User size={20} />
//             <span className="hidden md:inline">{user?.email || "User"}</span>
//           </button>
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white text-[#11453B] rounded-md shadow-lg">
//               <div className="p-2 border-b border-gray-200">
//                 <p className="text-sm">{user?.email || "User"}</p>
//               </div>
//               <button
//                 className="flex items-center w-full p-2 hover:bg-gray-100"
//                 onClick={() => alert("Notifications clicked")}
//               >
//                 <Bell size={16} className="mr-2" />
//                 Notifications
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


'use client';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { User, Bell, Menu, X } from 'lucide-react';
import { useSidebar } from '../context/sidebarContext';
import Image from 'next/image';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { isCollapsed, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-[#11453B] text-white z-50 transition-all duration-300 ${
        isCollapsed ? 'md:ml-14' : 'md:ml-54'
      }`}
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-full">
        {/* Desktop: Show title, Mobile: Show logo */}
        <div className="flex items-center">
          <div className="md:hidden flex items-center">
            <Image
              src="/images/icare.png"
              alt="iCare Logo"
              width={40}
              height={40}
              className="mr-2"
            />
          </div>
          <div className="hidden md:block text-xl font-bold">
            iCare-Pro Dashboard
          </div>
        </div>

        {/* Desktop: Show user dropdown, Mobile: Show hamburger */}
        <div className="flex items-center space-x-4">
          {/* Hamburger menu for mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* User dropdown for desktop */}
          <div className="hidden md:block relative pr-0 md:pr-[24rem] lg:pr-[8rem] cursor-pointer">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none max-w-xs"
            >
              <User size={20} />
              {/* <span className="hidden md:inline truncate max-w-[200px]">
                {user?.email || 'User'}
              </span> */}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-[#11453B] rounded-md shadow-lg z-50">
                <div className="p-2 border-b border-gray-200">
                  <p className="text-sm truncate">{user?.email || 'User'}</p>
                </div>
                <button
                  className="flex items-center w-full p-2 hover:bg-gray-100"
                  onClick={() => alert('Notifications clicked')}
                >
                  <Bell size={16} className="mr-2" />
                  Notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}