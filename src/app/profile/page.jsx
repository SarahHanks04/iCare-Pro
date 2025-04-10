"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { Edit2Icon } from "lucide-react";
import { loginSuccess } from "../redux/slices/authSlice";

export default function Profile() {
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth.user) || {};
  // const email = useSelector((state) => state.auth.email) || "";

  // const [avatar, setAvatar] = useState(
  //   localStorage.getItem(`avatar-${email}`) || "/images/default-avatar.jpg"
  // );
  // const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  // const [isEditingInfo, setIsEditingInfo] = useState(false);
  // const [formData, setFormData] = useState({
  //   name: user.name || "",
  //   email: email || "",
  //   phoneNumber: localStorage.getItem(`phone-${email}`) || "",
  // });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || {};
  const email = user.email || ""; // Access email from user object

  const [avatar, setAvatar] = useState(
    localStorage.getItem(`avatar-${email}`) || "/images/default-avatar.jpg"
  );
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: email || "",
    phoneNumber: localStorage.getItem(`phone-${email}`) || "",
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setAvatar(base64Image);
        localStorage.setItem(`avatar-${email}`, base64Image);
      };
      reader.readAsDataURL(file);
    }
    setIsEditingAvatar(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(`phone-${email}`, formData.phoneNumber);

    const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
    const userIndex = mockedUsers.findIndex((u) => u.email === email);
    if (userIndex !== -1) {
      mockedUsers[userIndex].name = formData.name;
      mockedUsers[userIndex].email = formData.email;
      localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));
    }

    dispatch(
      loginSuccess({
        email: formData.email,
        name: formData.name,
        token: localStorage.getItem("token"),
      })
    );

    setIsEditingInfo(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: email || "",
      phoneNumber: localStorage.getItem(`phone-${email}`) || "",
    });
    setIsEditingInfo(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-8 text-center">
            <div className="relative mx-auto w-32 h-32">
              <Image
                src={avatar}
                alt="Profile Avatar"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <Edit2Icon className="h-5 w-5 text-teal-600" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">
              {formData.name}
            </h1>
            <p className="mt-2 text-teal-100">{formData.email}</p>
          </div>

          {/* Personal Information Section */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Personal Information
              </h2>
              {!isEditingInfo && (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Edit2Icon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-800 rounded-lg bg-gray-50">
                      {formData.name || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  {isEditingInfo ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-800 rounded-lg bg-gray-50">
                      {formData.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      placeholder="+1 (123) 456-7890"
                    />
                  ) : (
                    <p className="px-4 py-2 text-gray-800 rounded-lg bg-gray-50">
                      {formData.phoneNumber || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {isEditingInfo && (
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}