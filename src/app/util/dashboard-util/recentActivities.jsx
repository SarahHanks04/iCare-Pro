"use client";

import { motion } from "framer-motion";

export default function RecentActivity({ recentUsers, upcomingEvents }) {
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
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
    >
      {/* Recent Users Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-[#11453B]">Recent Users</h3>
          <a
            href="/users"
            className="text-sm text-[#11453B] hover:text-[#11453B]/70 transition-colors duration-200"
          >
            View All →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-[#11453B]/10">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Joined</th>
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
                      <div className="w-8 h-8 rounded-full bg-[#F0F7EB80] flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-[#11453B]">
                          {user.first_name.charAt(0)}
                          {user.last_name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-[#11453B]">
                        {`${user.first_name} ${user.last_name}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-3 text-sm text-gray-500">
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

      {/* Upcoming Events Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-[#11453B]">
            Upcoming Events
          </h3>
          <a
            href="/events"
            className="text-sm text-[#11453B] hover:text-[#11453B]/70 transition-colors duration-200"
          >
            View All →
          </a>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="flex justify-between items-center p-4 rounded-lg hover:bg-[#F0F7EB80] transition-all duration-200"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-[#11453B] flex items-center justify-center mr-4">
                  <span className="text-white text-xs font-bold">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#11453B]">{event.name}</p>
                  <p className="text-xs text-gray-500">{event.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#11453B] font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {event.duration || "2 hours"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
