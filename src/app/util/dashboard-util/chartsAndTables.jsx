"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartsAndTables({ roleData }) {
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          boxHeight: 6,
          padding: 12,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* Pie Chart */}
      <motion.div
        variants={cardVariants}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <h3 className="text-lg font-medium text-[#11453B]">
          Role Distribution
        </h3>
        <div className="w-full h-64">
          <Pie data={roleData} options={options} />
        </div>

        <style jsx>{`
          .chart-legend {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
          }
          .chart-legend > div {
            flex: 1 1 50%;
            display: flex;
            align-items: center;
          }
        `}</style>
      </motion.div>

      {/* Enrollment Trends */}
      <motion.div
        variants={cardVariants}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-[#11453B]">
            Enrollment Trends
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#11453B]">Jan</span>
            <div className="w-3/4 h-[6px] bg-[#F0F7EB80] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ delay: 0.4, duration: 1 }}
                className="h-full bg-[#11453B] rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-[#11453B]">10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#11453B]">Feb</span>
            <div className="w-3/4 h-[6px] bg-[#F0F7EB80] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full bg-[#11453B] rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-[#11453B]">15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#11453B]">Mar</span>
            <div className="w-3/4 h-[6px] bg-[#F0F7EB80] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "32%" }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-full bg-[#11453B] rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-[#11453B]">8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#11453B]">Apr</span>
            <div className="w-3/4 h-[6px] bg-[#F0F7EB80] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "48%" }}
                transition={{ delay: 0.7, duration: 1 }}
                className="h-full bg-[#11453B] rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-[#11453B]">12</span>
          </div>
        </div>
      </motion.div>

      {/* Revenue Breakdown */}
      <motion.div
        variants={cardVariants}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-[#11453B]">
            Revenue Breakdown
          </h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Membership Fees", value: 40, color: "#11453B" },
            { label: "Sponsorship", value: 20, color: "#0E3A32" },
            { label: "Event Fees", value: 20, color: "#1A5A4D" },
            { label: "Others", value: 20, color: "#F0F7EB80" },
          ].map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-[#11453B]">{item.label}</span>
                <span className="text-sm font-medium text-[#11453B]">
                  {item.value}%
                </span>
              </div>
              <div className="w-full h-[6px] bg-[#F0F7EB80] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
