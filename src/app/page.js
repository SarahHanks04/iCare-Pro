import Image from "next/image";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <div className="">
      <div className="bg-gray-200 min-h-screen">
        <Dashboard />
      </div>
    </div>
  );
}
