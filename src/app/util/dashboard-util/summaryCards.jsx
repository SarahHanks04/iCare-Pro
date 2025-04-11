"use client";

import { motion } from "framer-motion";
import { CircleCheck, Plus, UserRoundCheck } from "lucide-react";

export default function SummaryCards({ totalUsers, newUsers, activeUsers }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const statVariants = {
    hidden: { scale: 0.9 },
    visible: {
      scale: 1,
      transition: { delay: 0.2, type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Users Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-white p-6 rounded-xl shadow-lg border-l-3 border-[#4BC0C0] hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-gray-500">Total Users</h3>
          <div className="w-8 h-8 rounded-full bg-[#F0F7EB80] flex items-center justify-center">
            <span className="text-[#11453B] text-sm font-bold">
              <UserRoundCheck size={15} />
            </span>
          </div>
        </div>
        <motion.p
          variants={statVariants}
          className="text-4xl font-bold text-[#11453B]"
        >
          {totalUsers}
        </motion.p>
        <div className="mt-4 h-1 bg-[#F0F7EB80] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: 1 }}
            className="h-full bg-[#FFCE56]"
          />
        </div>
      </motion.div>

      {/* New Users Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-lg border-l-3 border-[#FF6384] hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-gray-500">
            New Users (2 Days ago)
          </h3>
          <div className="w-8 h-8 rounded-full bg-[#F0F7EB80] flex items-center justify-center">
            <span className="text-[#11453B] text-sm font-bold">
              <Plus size={15} />
            </span>
          </div>
        </div>
        <motion.p
          variants={statVariants}
          className="text-4xl font-bold text-[#11453B]"
        >
          {newUsers}
        </motion.p>
        <div className="mt-4 h-1 bg-[#F0F7EB80] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((newUsers / totalUsers) * 100, 100)}%`,
            }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-full bg-[#FFCE56]"
          />
        </div>
      </motion.div>

      {/* Active Users Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg border-l-3 border-[#36A2EB] hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-gray-500">Active Users</h3>
          <div className="w-8 h-8 rounded-full bg-[#F0F7EB80] flex items-center justify-center">
            <span className="text-[#11453B] text-sm font-bold">
              <CircleCheck size={15} />
            </span>
          </div>
        </div>
        <motion.p
          variants={statVariants}
          className="text-4xl font-bold text-[#11453B]"
        >
          {activeUsers}
        </motion.p>
        <div className="mt-4 h-1 bg-[#F0F7EB80] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((activeUsers / totalUsers) * 100, 100)}%`,
            }}
            transition={{ delay: 0.6, duration: 1 }}
            className="h-full bg-[#FFCE56]"
          />
        </div>
      </motion.div>
    </div>
  );
}
