"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { X } from "lucide-react";

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newUser = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.role,
        status: data.status,
        avatar: imagePreview || "/images/default-avatar.jpg",
        created_at: new Date().toISOString(), // Add created_at timestamp
        id: Date.now().toString(), // Generate a unique ID for the new user
      };

      // Simulate API call (since reqres.in doesn't persist data)
      const response = await axios.post("https://reqres.in/api/users", newUser);

      // Use the local data since reqres.in doesn't persist
      onUserAdded(newUser);
      reset();
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error(
        "Error adding user:",
        error.response?.data || error.message
      );
      setError("Failed to add user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
      <div className="bg-[#F0F7EB80] backdrop-blur-lg rounded-lg px-8 py-3 shadow-xl max-w-lg w-full border border-[#11453B]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#11453B]">Add New User</h2>
          <button
            onClick={onClose}
            className="text-[#11453B] hover:text-[#11453B]/70 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <label className="block text-sm font-medium text-[#11453B] mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("avatar")}
              onChange={handleImageChange}
              className="w-full p-2 rounded-md cursor-pointer bg-white/20 text-[#11453B] border border-[#11453B]/30 focus:outline-none focus:ring-0 focus:ring-[#11453B]/50"
            />
            {errors.avatar && (
              <p className="text-red-500 text-sm mt-1">
                {errors.avatar.message}
              </p>
            )}
          </div>

          {/* First Name and Last Name */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#11453B] mb-1">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full cursor-pointer p-2 rounded-md bg-white/20 text-[#11453B] placeholder-gray-500 border border-[#11453B]/30 focus:outline-none focus:ring-0 focus:ring-[#11453B]/50"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#11453B] mb-1">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full p-2 cursor-pointer rounded-md bg-white/20 text-[#11453B] placeholder-gray-500 border border-[#11453B]/30 focus:outline-none focus:ring-0 focus:ring-[#11453B]/50"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email and Role */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#11453B] mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="w-full p-2 rounded-md bg-white/20 text-[#11453B] placeholder-gray-500 border border-[#11453B]/30 focus:outline-none focus:ring-0 cursor-pointer focus:ring-[#11453B]/50"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#11453B] mb-1">
                Role
              </label>
              <select
                {...register("role", { required: "Role is required" })}
                className="w-full p-2 rounded-md bg-white/20 text-[#11453B] border border-[#11453B]/30 focus:outline-none focus:ring-0 cursor-pointer focus:ring-[#11453B]/50"
              >
                <option value="" className="text-gray-500">
                  Select a role
                </option>
                <option value="Admin">Admin</option>
                <option value="General Partner">General Partner</option>
                <option value="Wealth Manager">Wealth Manager</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#11453B] mb-1">
              Status
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full p-2 rounded-md bg-white/20 text-[#11453B] border border-[#11453B]/30 focus:outline-none focus:ring-0 cursor-pointer focus:ring-[#11453B]/50"
            >
              <option value="" className="text-gray-500">
                Select a status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500/50 cursor-pointer text-sm text-white rounded-md hover:bg-gray-600/50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm cursor-pointer bg-[#11453B] text-white rounded-md hover:bg-[#11453B]/80 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
