"use client";

import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

export default function ChartsAndTables({ roleData, users }) {
  const pieOptions = {
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

  // User Activity Trends
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const userActivity = months.map((month, index) => {
    const count = users.filter((user) => {
      const createdAt = new Date(user.created_at || "2025-04-08");
      return createdAt.getMonth() === index;
    }).length;
    return { month, count };
  });

  // Line chart Data
  const lineData = {
    labels: userActivity.map((item) => item.month),
    datasets: [
      {
        label: "Users Created",
        data: userActivity.map((item) => item.count),
        fill: false,
        borderColor: "#FF6B6B",
        backgroundColor: "#11453B",
        borderWidth: 1,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#4A90E2",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F0F7EB80",
        },
        ticks: {
          color: "#4A90E2",
          stepSize: 1,
        },
      },
    },
  };

  // Status Breakdown
  const statusCounts = users.reduce((acc, user) => {
    const status = (user.status || "Active").toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const totalStatusUsers = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const statusData = Object.keys(statusCounts).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: totalStatusUsers
      ? Math.round((statusCounts[status] / totalStatusUsers) * 100)
      : 0,
    color:
      status === "active"
        ? "#4A90E2"
        : status === "inactive"
        ? "#FF6B6B"
        : "#FFD93D",
  }));

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
        <h3 className="text-xl font-semibold text-[#11453B]">
          Role Distribution
        </h3>
        <div className="w-full h-64">
          <Pie data={roleData} options={pieOptions} />
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

      {/* Line Chart */}
      <motion.div
        variants={cardVariants}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#11453B]">
            User Activity Trends
          </h3>
        </div>
        <div className="w-full h-64">
          {userActivity.some((item) => item.count > 0) ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p className="text-sm text-gray-500">
              No user activity data available.
            </p>
          )}
        </div>
      </motion.div>

      {/* Status Breakdown */}
      <motion.div
        variants={cardVariants}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-[#11453B]/10 hover:shadow-md transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#11453B]">
            Status Breakdown
          </h3>
        </div>
        <div className="space-y-4">
          {statusData.map((item, index) => (
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
