"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserActionsPage() {
  const [userActions, setUserActions] = useState([]);

  useEffect(() => {
    const fetchUserActions = () => {
      const actions = JSON.parse(localStorage.getItem("userActions")) || [];
      setUserActions(actions);
    };

    fetchUserActions();

    const handleStorageChange = (event) => {
      if (event.key === "userActions") {
        fetchUserActions();
      }
    };

    const handleCustomStorageUpdate = () => {
      fetchUserActions();
    };

    window.addEventListener("storage", handleStorageChange);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#11453B]">
            All User Actions
          </h1>
          <Link
            href="/dashboard"
            className="text-sm text-[#11453B] hover:text-[#11453B]/70 transition-colors duration-200"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10"
        >
          <div className="space-y-4">
            {userActions.length > 0 ? (
              userActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center p-4 rounded-lg hover:bg-[#F0F7EB80] transition-all duration-200 border-b border-[#11453B]/10 last:border-0"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center mr-4 ${
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
                      <p className="font-medium text-[#11453B]">
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
                    <p className="text-sm text-[#11453B] font-medium">
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
              <p className="text-sm text-gray-500">
                No user actions available.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
