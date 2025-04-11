"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { setLoading, setError, setUsers } from "../redux/slices/userSlice";
import { getUsers, updateUser } from "../_lib/api";
import "../styles/userTable.css";
import EllipsisDropdown from "../components/ellipsis-dropdown";
import Loading from "../loading";
import toast from "react-hot-toast";
import SearchComponent from "../util/search";
import Pagination from "../util/pagination";
// import { logUserAction } from "../util/dashboard-util/userActions";

export default function UserTable() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading());
      try {
        const data = await getUsers();
        dispatch(setUsers(data));
        setFilteredUsers(data);
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

  
  // const handleUserAdded = (newUser) => {
  //   const updatedUsers = [newUser, ...users];
  //   dispatch(setUsers(updatedUsers));
  //   setFilteredUsers(updatedUsers);

  //   const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
  //   localUsers.unshift(newUser);
  //   localStorage.setItem("localUsers", JSON.stringify(localUsers));

  //   
  //   logUserAction("added", newUser);
  // };

  // const onEditStart = (user) => {
  //   setEditingUserId(user.id);
  //   reset({
  //     first_name: user.first_name,
  //     last_name: user.last_name,
  //     email: user.email,
  //     role: user.role || "General Back Office",
  //     status: user.status || "Active",
  //     created_at: user.created_at
  //       ? new Date(user.created_at).toISOString().split("T")[0]
  //       : "2025-04-08",
  //   });
  // };

  const onEditSave = async (data, userId) => {
    try {
      const updatedUserData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        status: data.status,
        created_at: data.created_at,
      };
      const response = await updateUser(userId, updatedUserData);
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, ...response } : user
      );
      dispatch(setUsers(updatedUsers));
      setFilteredUsers(updatedUsers);

      const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
      const updatedLocalUsers = localUsers.map((user) =>
        user.id === userId ? { ...user, ...response } : user
      );
      localStorage.setItem("localUsers", JSON.stringify(updatedLocalUsers));

      setEditingUserId(null);
      reset();
      toast.success("User updated successfully!", {
        duration: 2000,
      });
    } catch (error) {
      toast.error(`Failed to update user: ${error.message}`, {
        duration: 3000,
      });
    }
  };

  // Inside the onEditSave function
  // const onEditSave = async (data, userId) => {
  //   try {
  //     const updatedUserData = {
  //       first_name: data.first_name,
  //       last_name: data.last_name,
  //       email: data.email,
  //       role: data.role,
  //       status: data.status,
  //       created_at: data.created_at,
  //     };
  //     const response = await updateUser(userId, updatedUserData);
  //     const updatedUsers = users.map((user) =>
  //       user.id === userId ? { ...user, ...response } : user
  //     );
  //     dispatch(setUsers(updatedUsers));
  //     setFilteredUsers(updatedUsers);

  //     const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
  //     const updatedLocalUsers = localUsers.map((user) =>
  //       user.id === userId ? { ...user, ...response } : user
  //     );
  //     localStorage.setItem("localUsers", JSON.stringify(updatedLocalUsers));

  //     // Log the action
  //     logUserAction("updated", response, {
  //       updatedFields: Object.keys(updatedUserData),
  //     });

  //     setEditingUserId(null);
  //     reset();
  //     toast.success("User updated successfully!", {
  //       duration: 2000,
  //     });
  //   } catch (error) {
  //     toast.error(`Failed to update user: ${error.message}`, {
  //       duration: 3000,
  //     });
  //   }
  // };

  const onEditCancel = () => {
    setEditingUserId(null);
    reset();
  };

  // Pagination logic
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Paginated users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const welcomeMessage = loggedInUser
    ? `Welcome ${loggedInUser.name}`
    : "Welcome User";

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{welcomeMessage},</h2>

      <div className="btn-group-container">
        <div className="btn-group">
          <button className="btn admin-btn">ADMINISTRATION</button>
          <button className="btn">GENERAL PARTNERS</button>
          <button className="btn">WEALTH MANAGERS</button>
        </div>
      </div>

      <SearchComponent
        users={users}
        onFilteredUsers={setFilteredUsers}
        onUserAdded={handleUserAdded}
      />

      <div className="overflow-x-auto pt-4">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-sm">
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
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className={`${
                  editingUserId === user.id
                    ? "bg-yellow-50 border-l-4 border-yellow-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded cursor-pointer" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUserId === user.id ? (
                    <div className="flex flex-col sm:flex-row sm:space-x-2">
                      <div>
                        <input
                          type="text"
                          {...register("first_name", {
                            required: "First name is required",
                          })}
                          className="p-1 border rounded w-full sm:w-24"
                        />
                        {errors.first_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          {...register("last_name", {
                            required: "Last name is required",
                          })}
                          className="p-1 border rounded w-full sm:w-24"
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
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
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingUserId === user.id ? (
                    <div>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        className="p-1 border rounded w-full"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingUserId === user.id ? (
                    <select
                      {...register("role", { required: "Role is required" })}
                      className="p-1 border rounded w-full"
                    >
                      <option value="General Back Office">
                        General Back Office
                      </option>
                      <option value="Admin">Admin</option>
                      <option value="General Partner">General Partner</option>
                      <option value="Wealth Manager">Wealth Manager</option>
                    </select>
                  ) : (
                    user.role || "General Back Office"
                  )}
                </td>
                <td className="pr-6 py-4 pl-10 whitespace-nowrap text-sm text-gray-500">
                  {editingUserId === user.id ? (
                    <input
                      type="date"
                      {...register("created_at", {
                        required: "Created date is required",
                      })}
                      className="p-1 border rounded w-full"
                    />
                  ) : user.created_at ? (
                    new Date(user.created_at).toLocaleDateString("en-US")
                  ) : (
                    "4/8/2025"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUserId === user.id ? (
                    <select
                      {...register("status", {
                        required: "Status is required",
                      })}
                      className="p-1 border rounded w-full"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  ) : (
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
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingUserId === user.id ? (
                    <div className="flex justify-end space-x-2 text-xs">
                      <button
                        onClick={handleSubmit((data) =>
                          onEditSave(data, user.id)
                        )}
                        className="px-3 py-1 bg-[#11453B] text-white rounded hover:bg-[#0d3a2f]"
                      >
                        Save
                      </button>
                      <button
                        onClick={onEditCancel}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <EllipsisDropdown
                      user={user}
                      onEdit={onEditStart}
                      users={users}
                      setUsers={(updatedUsers) =>
                        dispatch(setUsers(updatedUsers))
                      }
                      setFilteredUsers={setFilteredUsers}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}



