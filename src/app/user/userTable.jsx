// "use client";

// import { useSelector, useDispatch } from "react-redux";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import toast from "react-hot-toast";
// import { setLoading, setError, setUsers } from "../redux/slices/userSlice";
// import { getUsers } from "../_lib/api";
// import "../styles/userTable.css";
// import AddUserButton from "../util/users-util/add-users-button";
// import SearchFilter from "../util/search-filter";
// import EllipsisDropdown from "../components/ellipsis-dropdown";

// export default function UserTable() {
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => state.users);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     role: "",
//     status: "",
//   });

//   useEffect(() => {
//     const fetchUsers = async () => {
//       dispatch(setLoading());
//       try {
//         const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
//         const data = await getUsers();
//         const combinedUsers = [...localUsers, ...data.data];
//         dispatch(setUsers(combinedUsers));
//         setFilteredUsers(combinedUsers);
//       } catch (err) {
//         dispatch(setError(err.message));
//       }
//     };
//     fetchUsers();
//   }, [dispatch]);

//   const handleUserAdded = (newUser) => {
//     const updatedUsers = [newUser, ...users];
//     dispatch(setUsers(updatedUsers));
//     setFilteredUsers(updatedUsers);

//     const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
//     localUsers.unshift(newUser);
//     localStorage.setItem("localUsers", JSON.stringify(localUsers));
//   };

//   const handleEditUser = (user) => {
//     setEditingUserId(user.id);
//     setEditFormData({
//       first_name: user.first_name,
//       last_name: user.last_name,
//       email: user.email,
//       role: user.role || "General Back Office",
//       status: user.status || "Active",
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSaveEdit = (userId) => {
//     const updatedUsers = users.map((user) =>
//       user.id === userId ? { ...user, ...editFormData } : user
//     );
//     dispatch(setUsers(updatedUsers));
//     setFilteredUsers(updatedUsers);

//     // Update localStorage if the user was locally added
//     const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
//     const updatedLocalUsers = localUsers.map((user) =>
//       user.id === userId ? { ...user, ...editFormData } : user
//     );
//     localStorage.setItem("localUsers", JSON.stringify(updatedLocalUsers));

//     setEditingUserId(null);
//     toast.success("User details updated successfully!");
//   };

//   const handleCancelEdit = () => {
//     setEditingUserId(null);
//     setEditFormData({
//       first_name: "",
//       last_name: "",
//       email: "",
//       role: "",
//       status: "",
//     });
//   };

//   const handleExportUser = (user) => {
//     const dataStr = JSON.stringify(user, null, 2);
//     const blob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${user.first_name}_${user.last_name}.json`;
//     link.click();
//     URL.revokeObjectURL(url);
//     toast.success(`Exported ${user.first_name} ${user.last_name}'s details.`);
//   };

//   const handleDeleteUser = (user) => {
//     // Show confirmation toast with Delete and Cancel actions
//     toast(
//       (t) => (
//         <div className="flex items-center space-x-2">
//           <span>
//             Are you sure you want to delete {user.first_name} {user.last_name}?
//           </span>
//           <button
//             onClick={() => {
//               toast.dismiss(t.id); // Dismiss the confirmation toast
//               const deletedUser = { ...user };
//               const updatedUsers = users.filter((u) => u.id !== user.id);
//               dispatch(setUsers(updatedUsers));
//               setFilteredUsers(updatedUsers);

//               const localUsers =
//                 JSON.parse(localStorage.getItem("localUsers")) || [];
//               const updatedLocalUsers = localUsers.filter(
//                 (u) => u.id !== user.id
//               );
//               localStorage.setItem(
//                 "localUsers",
//                 JSON.stringify(updatedLocalUsers)
//               );

//               // Show success toast with Undo action
//               toast.success(
//                 `User ${user.first_name} ${user.last_name} has been deleted.`,
//                 {
//                   duration: 5000,
//                   icon: "🗑️",
//                   action: {
//                     text: "Undo",
//                     onClick: () => {
//                       const restoredUsers = [deletedUser, ...updatedUsers];
//                       dispatch(setUsers(restoredUsers));
//                       setFilteredUsers(restoredUsers);

//                       const restoredLocalUsers = [
//                         deletedUser,
//                         ...updatedLocalUsers,
//                       ];
//                       localStorage.setItem(
//                         "localUsers",
//                         JSON.stringify(restoredLocalUsers)
//                       );
//                       toast.success("User restored successfully!");
//                     },
//                   },
//                 }
//               );
//             }}
//             className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Delete
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//         </div>
//       ),
//       {
//         duration: 5000,
//         position: "top-right",
//       }
//     );
//   };

//   if (loading) return <div className="text-center py-8">Loading...</div>;
//   if (error)
//     return <div className="text-red-500 text-center py-8">Error: {error}</div>;

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Users</h2>
//       <div className="flex justify-between gap-6 mb-6">
//         <div className="btn-group">
//           <button className="btn admin-btn">ADMINISTRATION</button>
//           <button className="btn">GENERAL PARTNERS</button>
//           <button className="btn">WEALTH MANAGERS</button>
//         </div>
//         <AddUserButton onUserAdded={handleUserAdded} />
//       </div>

//       <SearchFilter users={users} onFilteredUsers={setFilteredUsers} />

//       <div className="overflow-x-auto pt-4">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th>
//                 <input type="checkbox" className="rounded cursor-pointer" />
//               </th>
//               <th>NAME</th>
//               <th>EMAIL</th>
//               <th>ROLE</th>
//               <th>CREATED ON</th>
//               <th>STATUS</th>
//               <th>ACTIONS</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredUsers.map((user) => (
//               <tr
//                 key={user.id}
//                 className={`${
//                   editingUserId === user.id
//                     ? "bg-yellow-50 border-l-4 border-yellow-500"
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <input type="checkbox" className="rounded cursor-pointer" />
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {editingUserId === user.id ? (
//                     <div className="flex items-center space-x-2">
//                       <input
//                         type="text"
//                         name="first_name"
//                         value={editFormData.first_name}
//                         onChange={handleEditChange}
//                         className="p-1 border rounded w-24"
//                       />
//                       <input
//                         type="text"
//                         name="last_name"
//                         value={editFormData.last_name}
//                         onChange={handleEditChange}
//                         className="p-1 border rounded w-24"
//                       />
//                     </div>
//                   ) : (
//                     <Link href={`/user/${user.id}`}>
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <Image
//                             src={user.avatar || "/images/default-avatar.png"}
//                             alt={`${user.first_name} ${user.last_name}`}
//                             width={40}
//                             height={40}
//                             className="rounded-full"
//                           />
//                         </div>
//                         <div className="ml-4">
//                           <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
//                             {user.first_name} {user.last_name}
//                           </span>
//                         </div>
//                       </div>
//                     </Link>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {editingUserId === user.id ? (
//                     <input
//                       type="email"
//                       name="email"
//                       value={editFormData.email}
//                       onChange={handleEditChange}
//                       className="p-1 border rounded w-full"
//                     />
//                   ) : (
//                     user.email
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {editingUserId === user.id ? (
//                     <select
//                       name="role"
//                       value={editFormData.role}
//                       onChange={handleEditChange}
//                       className="p-1 border rounded w-full"
//                     >
//                       <option value="General Back Office">
//                         General Back Office
//                       </option>
//                       <option value="admin">Admin</option>
//                       <option value="general">General Partner</option>
//                       <option value="manager">Wealth Manager</option>
//                     </select>
//                   ) : (
//                     user.role || "General Back Office"
//                   )}
//                 </td>
//                 <td className="pr-6 py-4 pl-10 whitespace-nowrap text-sm text-gray-500">
//                   {user.created_at
//                     ? new Date(user.created_at).toLocaleDateString("en-US")
//                     : "4/8/2025"}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {editingUserId === user.id ? (
//                     <select
//                       name="status"
//                       value={editFormData.status}
//                       onChange={handleEditChange}
//                       className="p-1 border rounded w-full"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                       <option value="pending">Pending</option>
//                     </select>
//                   ) : (
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full ${
//                         user.status === "active"
//                           ? "bg-green-100 text-green-800"
//                           : user.status === "inactive"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {user.status || "Active"}
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   {editingUserId === user.id ? (
//                     <div className="flex justify-end space-x-2">
//                       <button
//                         onClick={() => handleSaveEdit(user.id)}
//                         className="px-3 py-1 bg-[#11453B] text-white rounded hover:bg-[#0d3a2f]"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   ) : (
//                     <EllipsisDropdown
//                       user={user}
//                       onEdit={handleEditUser}
//                       onExport={handleExportUser}
//                       onDelete={handleDeleteUser}
//                     />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { setLoading, setError, setUsers } from "../redux/slices/userSlice";
import { getUsers } from "../_lib/api";
import "../styles/userTable.css";
import AddUserButton from "../util/users-util/add-users-button";
import SearchFilter from "../util/search-filter";
import EllipsisDropdown from "../components/ellipsis-dropdown";

export default function UserTable() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

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

  const onEditStart = (user) => {
    setEditingUserId(user.id);
    reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role || "General Back Office",
      status: user.status || "Active",
      created_at: user.created_at
        ? new Date(user.created_at).toISOString().split("T")[0]
        : "2025-04-08",
    });
  };

  const onEditSave = (data, userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...data } : user
    );
    dispatch(setUsers(updatedUsers));
    setFilteredUsers(updatedUsers);

    const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    const updatedLocalUsers = localUsers.map((user) =>
      user.id === userId ? { ...user, ...data } : user
    );
    localStorage.setItem("localUsers", JSON.stringify(updatedLocalUsers));

    setEditingUserId(null);
    reset();
  };

  const onEditCancel = () => {
    setEditingUserId(null);
    reset();
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
      </div>
    </div>
  );
}
