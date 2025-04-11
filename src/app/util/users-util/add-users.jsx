"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Plus, X } from "lucide-react";

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      throw new Error("Failed to upload image to Cloudinary: " + error.message);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let avatarUrl = "/images/default-avatar.jpg";
      if (imageFile) {
        avatarUrl = await uploadImageToCloudinary(imageFile);
      }

      const newUser = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.role,
        status: data.status,
        avatar: avatarUrl,
        created_at: new Date().toISOString(),
        id: Date.now().toString(),
      };

      onUserAdded(newUser);
      reset();
      setImagePreview(null);
      setImageFile(null);
      onClose();
    } catch (error) {
      console.error("Error adding user:", error.message);
      setError("Failed to add user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-[#F0F7EB] rounded-lg p-6 shadow-xl max-w-lg w-full border border-[#11453B]/20">
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
            <div
              onClick={handleAvatarClick}
              className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2 cursor-pointer relative hover:bg-gray-300 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <Plus size={32} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-1">
              Click on the avatar to upload an image
            </p>
          </div>

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
                className="w-full p-2 rounded-md bg-white text-[#11453B] placeholder-gray-500 border border-[#11453B]/30 focus:outline-none focus:ring-1 focus:ring-[#11453B]/50"
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
                className="w-full p-2 rounded-md bg-white text-[#11453B] placeholder-gray-500 border border-[#11453B]/30 focus:outline-none focus:ring-1 focus:ring-[#11453B]/50"
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
                className="w-full p-2 rounded-md bg-white text-[#11453B] placeholder-gray-500 border border-[#11453B]/30 focus:outline-none focus:ring-1 focus:ring-[#11453B]/50"
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
                className="w-full p-2 rounded-md bg-white text-[#11453B] border border-[#11453B]/30 focus:outline-none focus:ring-1 focus:ring-[#11453B]/50"
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin Manager</option>
                <option value="General Partner">General Manager</option>
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
              className="w-full p-2 rounded-md bg-white text-[#11453B] border border-[#11453B]/30 focus:outline-none focus:ring-1 focus:ring-[#11453B]/50"
            >
              <option value="">Select a status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
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
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#11453B] text-white rounded-md hover:bg-[#0d3b33] transition-colors disabled:opacity-50"
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
