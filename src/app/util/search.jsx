"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import AddUserButton from "./users-util/add-users-button";

export default function SearchComponent({
  users,
  onFilteredUsers,
  onUserAdded,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Search logic
  useEffect(() => {
    let filtered = [...users];

    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.first_name.toLowerCase().includes(lowerCaseQuery) ||
          user.last_name.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery) ||
          (user.first_name + " " + user.last_name)
            .toLowerCase()
            .includes(lowerCaseQuery)
      );
    }

    onFilteredUsers(filtered);
  }, [searchQuery, users, onFilteredUsers]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between space-x-4">
        {/* Search Input */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search Users"
            className="pl-10 pr-10 py-2 border rounded w-full focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <AddUserButton onUserAdded={onUserAdded} />
      </div>

      {/* No Results Message */}
      {searchQuery &&
        users.filter(
          (user) =>
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.first_name + " " + user.last_name)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        ).length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No users found matching "{searchQuery}".
          </div>
        )}
    </div>
  );
}
