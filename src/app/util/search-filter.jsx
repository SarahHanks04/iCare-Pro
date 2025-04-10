"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

export default function SearchFilter({ users, onFilteredUsers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  // Combined search and filter logic
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
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

    // Apply selected filter immediately
    if (selectedFilter) {
      filtered = applyFilters(filtered);
    }

    onFilteredUsers(filtered);
  }, [searchQuery, selectedFilter, users, onFilteredUsers]);

  // Apply filters based on selected filter type
  const applyFilters = (usersToFilter) => {
    let filtered = [...usersToFilter];

    if (selectedFilter === "name") {
      // Example: Filter to users with names starting with "J"
      filtered = filtered.filter(
        (user) =>
          user.first_name.toLowerCase().startsWith("j") ||
          user.last_name.toLowerCase().startsWith("j")
      );
    } else if (selectedFilter === "email") {
      // Example: Filter to emails ending with ".com"
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().endsWith(".com")
      );
    } else if (selectedFilter === "role") {
      // Filter to "Admin" role
      filtered = filtered.filter(
        (user) => user.role?.toLowerCase() === "admin"
      );
    } else if (selectedFilter === "status") {
      // Filter to "Active" status
      filtered = filtered.filter(
        (user) => user.status?.toLowerCase() === "active"
      );
    } else if (selectedFilter === "date") {
      // Filter to current year
      const currentYear = new Date().getFullYear().toString();
      filtered = filtered.filter((user) =>
        user.created_at
          ? new Date(user.created_at).getFullYear().toString() === currentYear
          : false
      );
    }

    return filtered;
  };

  // Handle filter selection with immediate filtering
  const handleFilterSelect = (filterType) => {
    setSelectedFilter(filterType);
    setShowFilterDropdown(false);

    // Reset to all users if no filter selected
    if (!filterType) {
      onFilteredUsers(users);
    }
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedFilter("");
    setSearchQuery("");
    onFilteredUsers(users);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between space-x-4 relative">
        {/* Search Input */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search Users"
            className="pl-10 pr-10 py-2 border rounded w-full"
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

        {/* Filter Button and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="px-4 py-2 border rounded flex items-center space-x-2"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-12 bg-white p-2 rounded shadow-lg border z-10 w-48">
              <button
                onClick={() => handleFilterSelect("name")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Name (Starts with J)
              </button>
              <button
                onClick={() => handleFilterSelect("email")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Email (.com)
              </button>
              <button
                onClick={() => handleFilterSelect("role")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Role (Admin)
              </button>
              <button
                onClick={() => handleFilterSelect("status")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Status (Active)
              </button>
              <button
                onClick={() => handleFilterSelect("date")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Date (This Year)
              </button>
              <button
                onClick={() => handleFilterSelect("")}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
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
