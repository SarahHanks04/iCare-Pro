"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLoading, setError, setUsers } from "../redux/slices/userSlice";
import { getUsers } from "../_lib/api";
import Loading from "../loading";
import SummaryCards from "../util/dashboard-util/summaryCards";
import ChartsAndTables from "../util/dashboard-util/chartsAndTables";
import RecentActivity from "../util/dashboard-util/recentActivities";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  // Metrics
  const totalUsers = users.length;
  const newUsers = users.filter((user) => {
    const createdAt = new Date(user.created_at || "2025-04-08");
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return createdAt >= twoDaysAgo;
  }).length;
  const activeUsers = users.filter(
    (user) => (user.status || "Active").toLowerCase() === "active"
  ).length;

  // Role distribution
  const roleCounts = users.reduce((acc, user) => {
    const role = user.role || "General Back Office";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const roleData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: ["#4A90E2", "#FF6B6B", "#FFD93D", "#1ABC9C"],
        hoverBackgroundColor: ["#4A90E2", "#FF6B6B", "#FFD93D", "#1ABC9C"],
      },
    ],
  };

  // Recent users
  const recentUsers = users.slice(0, 3);

  // Upcoming events
  const upcomingEvents = [
    {
      date: "26 Fri",
      name: "Basketball Skills Workshop",
      location: "Indoor Basketball Court",
    },
    {
      date: "28 Sun",
      name: "Soccer Tournament",
      location: "Main Soccer Field",
    },
  ];

  // Greetings
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  const welcomeMessage = loggedInUser
    ? `${getGreeting()}, ${loggedInUser.name}`
    : `${getGreeting()}, User`;

  // Last Seen
  const [lastSeen, setLastSeen] = useState(null);
  useEffect(() => {
    const lastSeenTime = localStorage.getItem("lastSeen");
    if (lastSeenTime) {
      setLastSeen(new Date(lastSeenTime));
    }

    const now = new Date();
    localStorage.setItem("lastSeen", now.toISOString());
  }, []);

  if (loading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold">{welcomeMessage}</h1>
          <p className="text-sm text-gray-500">
            {lastSeen
              ? `Last Seen: ${lastSeen.toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}`
              : "First Visit"}
          </p>
        </div>
      </div>

      <SummaryCards
        totalUsers={totalUsers}
        newUsers={newUsers}
        activeUsers={activeUsers}
      />

      <ChartsAndTables roleData={roleData} users={users} />

      <RecentActivity
        recentUsers={recentUsers}
        upcomingEvents={upcomingEvents}
      />
    </div>
  );
}
