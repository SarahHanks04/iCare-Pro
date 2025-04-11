"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecentActivity({ recentUsers }) {
  const [userActions, setUserActions] = useState([]);

  const fetchUserActions = () => {
    const actions = JSON.parse(localStorage.getItem("userActions")) || [];
    setUserActions(actions.slice(0, 5));
  };

  useEffect(() => {
    fetchUserActions();
    const handleStorageChange = (event) => {
      if (event.key === "userActions") {
        fetchUserActions();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const handleCustomStorageUpdate = () => {
      fetchUserActions();
    };

    window.addEventListener("userActionLogged", handleCustomStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userActionLogged", handleCustomStorageUpdate);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6"
    >
      {/* Recent Users Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#11453B] sm:text-lg">
            Recent Users
          </h3>
          <Link
            href="/users"
            className="text-sm text-[#11453B] hover:text-[#11453B]/70 transition-colors duration-200"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-[#11453B]/10">
                <th className="pb-3 font-medium sm:text-xs">Name</th>
                <th className="pb-3 font-medium sm:text-xs">Email</th>
                <th className="pb-3 font-medium sm:text-xs">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: "#F0F7EB80" }}
                  className="border-b border-[#11453B]/10 last:border-0"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#F0F7EB]/80 flex items-center justify-center mr-3 sm:w-8 sm:h-8">
                        <span className="text-sm font-bold text-[#11453B] sm:text-xs">
                          {user.first_name.charAt(0)}
                          {user.last_name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-[#11453B] sm:text-sm">
                        {`${user.first_name} ${user.last_name}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600 sm:text-xs">
                    {user.email}
                  </td>
                  <td className="py-3 text-sm text-gray-500 sm:text-xs">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Apr 8, 2025"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Actions Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#11453B] sm:text-lg">
            User Actions
          </h3>
          <Link
            href="/actions"
            className="text-sm text-[#11453B] hover:text-[#11453B]/70 transition-colors duration-200"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {userActions.length > 0 ? (
            userActions.map((action, index) => (
              <motion.div
                key={action.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center p-4 rounded-lg hover:bg-[#F0F7EB80] transition-all duration-200"
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center mr-4 sm:w-8 sm:h-8 ${
                      action.actionType === "added"
                        ? "bg-green-500"
                        : action.actionType === "updated"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  >
                    <span className="text-white text-xs font-bold">
                      {action.actionType === "added"
                        ? "A"
                        : action.actionType === "updated"
                        ? "U"
                        : "D"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#11453B] sm:text-sm">
                      {action.actionType === "added" &&
                        `Added ${action.user.first_name} ${action.user.last_name}`}
                      {action.actionType === "updated" &&
                        `Updated ${action.user.first_name} ${action.user.last_name}`}
                      {action.actionType === "deleted" &&
                        `Deleted ${action.user.first_name} ${action.user.last_name}`}
                    </p>
                    {action.details?.updatedFields && (
                      <p className="text-xs text-gray-500">
                        Updated: {action.details.updatedFields.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#11453B] font-medium sm:text-xs">
                    {new Date(action.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(action.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 sm:text-xs">
              No recent actions available.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
