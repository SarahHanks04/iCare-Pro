"use client";

import { useSelector, useDispatch } from "react-redux";
import { use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Briefcase,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import {
  setError,
  setLoading,
  setSelectedUser,
} from "@/app/redux/slices/userSlice";
import { getUserById } from "@/app/_lib/api";

export default function UserPage({ params }) {
  const { id } = use(params);
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading());
      try {
        const data = await getUserById(id);
        console.log("Fetched user data:", data);
        dispatch(setSelectedUser(data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    fetchUser();
  }, [id, dispatch]);

  if (loading)
    return <div className="text-center py-20 text-[#11453B]">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-20">Error: {error}</div>;
  if (!selectedUser)
    return (
      <div className="text-center py-20 text-[#11453B]">User not found</div>
    );

  return (
    <div className="p-6 bg-[#F0F7EB] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-xs text-[#11453B] hover:text-[#0d3a2f] transition-colors mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Users
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#11453B] p-4 text-white">
            <h1 className="text-2xl font-bold text-center">User Information</h1>
          </div>

          <div className="p-8">
            {/* Profile picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#F0F7EB] shadow-md">
                  <Image
                    src={selectedUser.avatar || "/images/default-avatar.png"}
                    alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[#11453B] text-white rounded-full p-2 shadow-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* User name */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#11453B] inline-block pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#E2A03F] after:rounded-full">
                {selectedUser.first_name} {selectedUser.last_name}
              </h2>
            </div>

            {/* User details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F0F7EB80] p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Mail className="h-5 w-5 text-[#11453B] mr-2" />
                  <span className="font-medium text-[#11453B]">Email</span>
                </div>
                <p className="text-gray-700 pl-7">
                  {selectedUser.email || "Email not available"}
                </p>
              </div>

              <div className="bg-[#F0F7EB80] p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <Briefcase className="h-5 w-5 text-[#11453B] mr-2" />
                  <span className="font-medium text-[#11453B]">Role</span>
                </div>
                <p className="text-gray-700 pl-7">
                  {selectedUser.role || "General Back Office"}
                </p>
              </div>

              <div className="bg-[#F0F7EB80] p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <CheckCircle2 className="h-5 w-5 text-[#11453B] mr-2" />
                  <span className="font-medium text-[#11453B]">Status</span>
                </div>
                <p className="text-gray-700 pl-7">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.status === "Active"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedUser.status || "Active"}
                  </span>
                </p>
              </div>

              <div className="bg-[#F0F7EB80] p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <CalendarDays className="h-5 w-5 text-[#11453B] mr-2" />
                  <span className="font-medium text-[#11453B]">Created On</span>
                </div>
                <p className="text-gray-700 pl-7">
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "April 8, 2025"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
