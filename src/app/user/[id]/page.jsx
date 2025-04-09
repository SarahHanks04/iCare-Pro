"use client";

import { getUserById } from "@/app/_lib/api";
import Sidebar from "@/app/components/sidebar";
import { setLoading, setSelectedUser, setError } from "@/app/redux/slices/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function UserPage({ params }) {
  const { id } = params;
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading());
      try {
        const data = await getUserById(id);
        dispatch(setSelectedUser(data.data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    fetchUser();
  }, [id, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedUser) return <div>No user found.</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            {selectedUser.first_name} {selectedUser.last_name}
          </h2>
          <p>Email: {selectedUser.email}</p>
          <img
            src={selectedUser.avatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full mt-4"
          />
        </div>
      </div>
    </div>
  );
}
