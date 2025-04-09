"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

export default function SearchFilter({ users, onFilteredUsers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterValue, setFilterValue] = useState("");

  // Real-time search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      applyFilters(users); // Reset to all users if search query is empty
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(lowerCaseQuery) ||
        user.last_name.toLowerCase().includes(lowerCaseQuery) ||
        user.email.toLowerCase().includes(lowerCaseQuery) ||
        (user.first_name + " " + user.last_name)
          .toLowerCase()
          .includes(lowerCaseQuery)
    );
    onFilteredUsers(filtered);
  }, [searchQuery, users, onFilteredUsers]);

  // Apply filters based on selected filter type and value
  const applyFilters = (usersToFilter) => {
    let filtered = [...usersToFilter];

    if (selectedFilter && filterValue) {
      if (selectedFilter === "name") {
        const nameFilter = filterValue.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.first_name.toLowerCase().includes(nameFilter) ||
            user.last_name.toLowerCase().includes(nameFilter) ||
            (user.first_name + " " + user.last_name)
              .toLowerCase()
              .includes(nameFilter)
        );
      } else if (selectedFilter === "email") {
        filtered = filtered.filter((user) =>
          user.email.toLowerCase().includes(filterValue.toLowerCase())
        );
      } else if (selectedFilter === "role") {
        filtered = filtered.filter(
          (user) => user.role?.toLowerCase() === filterValue.toLowerCase()
        );
      } else if (selectedFilter === "status") {
        filtered = filtered.filter(
          (user) => user.status?.toLowerCase() === filterValue.toLowerCase()
        );
      } else if (selectedFilter === "date") {
        // Filter by year for simplicity (you can enhance this for full date filtering)
        filtered = filtered.filter((user) =>
          user.created_at
            ? new Date(user.created_at).getFullYear().toString() === filterValue
            : false
        );
      }
    }

    onFilteredUsers(filtered);
  };

  // Handle filter selection and apply filters
  const handleFilterSelect = (filterType) => {
    setSelectedFilter(filterType);
    setShowFilterDropdown(false);

    // Reset filter value when changing filter type
    setFilterValue("");

    // If no filter is selected, reset to all users
    if (!filterType) {
      onFilteredUsers(users);
    }
  };

  // Handle filter value change and apply filters
  const handleFilterValueChange = (value) => {
    setFilterValue(value);
    applyFilters(users);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedFilter("");
    setFilterValue("");
    setSearchQuery("");
    onFilteredUsers(users);
  };

  // Determine if there are no results
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.first_name + " " + user.last_name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

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
                Name
              </button>
              <button
                onClick={() => handleFilterSelect("email")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Email
              </button>
              <button
                onClick={() => handleFilterSelect("role")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Role
              </button>
              <button
                onClick={() => handleFilterSelect("status")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Status
              </button>
              <button
                onClick={() => handleFilterSelect("date")}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Date
              </button>
              <button
                onClick={resetFilters}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Input Based on Selected Filter */}
      {selectedFilter && (
        <div className="mt-4 flex items-center space-x-4">
          <div className="w-1/3">
            {selectedFilter === "name" && (
              <input
                type="text"
                placeholder="Filter by name"
                value={filterValue}
                onChange={(e) => handleFilterValueChange(e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
            {selectedFilter === "email" && (
              <input
                type="text"
                placeholder="Filter by email"
                value={filterValue}
                onChange={(e) => handleFilterValueChange(e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
            {selectedFilter === "role" && (
              <select
                value={filterValue}
                onChange={(e) => handleFilterValueChange(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="general">General Partner</option>
                <option value="manager">Wealth Manager</option>
              </select>
            )}
            {selectedFilter === "status" && (
              <select
                value={filterValue}
                onChange={(e) => handleFilterValueChange(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            )}
            {selectedFilter === "date" && (
              <input
                type="text"
                placeholder="Filter by year (e.g., 2025)"
                value={filterValue}
                onChange={(e) => handleFilterValueChange(e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {searchQuery && filteredUsers.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No users found matching "{searchQuery}".
        </div>
      )}
    </div>
  );
}
