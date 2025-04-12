"use client";

import { useState, useEffect, useRef } from "react";
import {
  EllipsisVertical,
  User,
  Pencil,
  Trash2,
  CloudDownload,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { updateUser, deleteUser } from "../_lib/api";
import { logUserAction } from "../util/dashboard-util/userActions";

export default function EllipsisDropdown({
  user,
  onEdit,
  users,
  setUsers,
  setFilteredUsers,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleEdit = () => {
    onEdit(user);
    setIsOpen(false);
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`User Details: ${user.first_name} ${user.last_name}`, 10, 10);
    doc.text(`Email: ${user.email}`, 10, 20);
    doc.text(`Role: ${user.role || "General Back Office"}`, 10, 30);
    doc.text(`Status: ${user.status || "Active"}`, 10, 40);
    doc.text(
      `Created On: ${
        user.created_at
          ? new Date(user.created_at).toLocaleDateString("en-US")
          : "4/8/2025"
      }`,
      10,
      50
    );
    doc.save(`${user.first_name}_${user.last_name}_details.pdf`);
    toast.success(`Exported ${user.first_name} ${user.last_name}'s details.`, {
      duration: 3000,
    });
    setIsOpen(false);
  };

  const handleDelete = async () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col border border-red-200`}
        >
          <div className="flex items-start p-4">
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Confirm Deletion
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {user.first_name} {user.last_name}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={async () => {
                    toast.dismiss();
                    try {
                      await deleteUser(user.id);
                      const updatedUsers = users.filter(
                        (u) => u.id !== user.id
                      );
                      setUsers(updatedUsers);
                      setFilteredUsers(updatedUsers);

                      // Update localStorage
                      const localUsers =
                        JSON.parse(localStorage.getItem("localUsers")) || [];
                      const updatedLocalUsers = localUsers.filter(
                        (u) => u.id !== user.id
                      );
                      localStorage.setItem(
                        "localUsers",
                        JSON.stringify(updatedLocalUsers)
                      );

                      logUserAction("deleted", user);

                      toast.success(
                        `${user.first_name} ${user.last_name} has been deleted.`,
                        {
                          duration: 2000,
                          icon: <Trash2 className="h-5 w-5 text-red-600" />,
                          position: "top-right",
                          style: {
                            background: "#fef2f2",
                            color: "#b91c1c",
                            border: "1px solid #fecaca",
                          },
                          ariaProps: {
                            role: "alert",
                            "aria-live": "polite",
                          },
                        }
                      );
                    } catch (error) {
                      toast.error(`Failed to delete user: ${error.message}`, {
                        duration: 2000,
                      });
                    }
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-xs cursor-pointer font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-0"
                >
                  Delete
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1 bg-white text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-0 border border-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 4000,
        position: "top-center",
        ariaProps: {
          role: "alert",
          "aria-live": "polite",
        },
      }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative dropdown-container" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
      >
        <EllipsisVertical size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <Link href={`/user/${user.id}`}>
              <button
                className="flex items-center w-full px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                View profile
              </button>
            </Link>
            <button
              onClick={handleEdit}
              className="flex items-center w-full px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit details
            </button>
            <button
              onClick={handleExport}
              className="flex items-center w-full px-4 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
            >
              <CloudDownload className="h-4 w-4 mr-2" />
              Export details
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center w-full px-4 py-2 cursor-pointer border-t border-gray-200 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete user
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
