"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { setLoading, setError, setUsers } from "../redux/slices/userSlice";
import { getUsers } from "../_lib/api";
import "../styles/userTable.css";
import AddUserButton from "../util/users-util/add-users-button";
import SearchFilter from "../util/search-filter";
import { EllipsisVertical } from "lucide-react";

export default function UserTable() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading());
      try {
        const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
        const data = await getUsers();
        const combinedUsers = [...localUsers, ...data.data];
        dispatch(setUsers(combinedUsers));
        setFilteredUsers(combinedUsers);
      } catch (err) {
        dispatch(setError(err.message));
      }
    };
    fetchUsers();
  }, [dispatch]);

  const handleUserAdded = (newUser) => {
    const updatedUsers = [newUser, ...users];
    dispatch(setUsers(updatedUsers));
    setFilteredUsers(updatedUsers);

    const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    localUsers.unshift(newUser);
    localStorage.setItem("localUsers", JSON.stringify(localUsers));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <div className="flex justify-between gap-6 mb-6">
        <div className="btn-group">
          <button className="btn admin-btn">ADMINISTRATION</button>
          <button className="btn">GENERAL PARTNERS</button>
          <button className="btn">WEALTH MANAGERS</button>
        </div>
        <AddUserButton onUserAdded={handleUserAdded} />
      </div>

      <SearchFilter users={users} onFilteredUsers={setFilteredUsers} />

      <div className="overflow-x-auto pt-4">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th>
                <input type="checkbox" className="rounded cursor-pointer" />
              </th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>CREATED ON</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded cursor-pointer" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/user/${user.id}`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={user.avatar || "/images/default-avatar.png"}
                          alt={`${user.first_name} ${user.last_name}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role || "General Back Office"}
                </td>
                <td className="pr-6 py-4 pl-10 whitespace-nowrap text-sm text-gray-500">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US")
                    : "4/8/2025"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.status || "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium cursor-pointer">
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <EllipsisVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
