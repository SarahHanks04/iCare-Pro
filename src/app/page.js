import Image from "next/image";
import UserTable from "./users/userTable";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import AuthenticatedLayout from "./(auth)/layout";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <div className="">
      {/* <Sidebar /> */}
      {/* <Navbar /> */}
      {/*  flex-1 md:pl-54 mt-14 */}
      <div className="bg-gray-200 min-h-screen">
        {/* <UserTable /> */}
        <Dashboard />
      </div>
    </div>
  );
}
